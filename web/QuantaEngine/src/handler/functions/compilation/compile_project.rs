use std::{path::{PathBuf, Path}, io::Cursor};

use actix_web::web;
use base64::{engine::general_purpose, Engine};
use basteh::Basteh;
use inline_assets::inline_file;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json, Map};
use tokio::{fs::{write, read, remove_dir_all, canonicalize, read_dir}, process::Command};
use walkdir::WalkDir;

use crate::handler::{Result, messages, functions::{socket_response}};

use super::{types::{BabelRc, PackageJson, CompileProjectResult, PostHTMLConfig}};

#[derive(Debug, Deserialize, Serialize)]
struct CompileProjectBody {
    data: Option<String>
}

pub async fn compile_project(
    request_id: String,
    process_id: String,
    socket_data: String,
    _data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: CompileProjectBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    let zip_data = body.data.expect("requires data");
    let zip_data = zip_data.replace("\"", "");
    let zip_data = general_purpose::STANDARD.decode(zip_data).expect("bad_zip");

    let zip_loc = format!("./data/{}", &process_id);
    let zip_loc = PathBuf::from(zip_loc);
    zip_extract::extract(Cursor::new(zip_data), &zip_loc, true)?;

    //begin process of verifying the build scripts etc
    let babel_loc = format!("./data/{}/.babelrc", &process_id);
    let babel_path = Path::new(&babel_loc);
    
    if babel_path.exists() {
        let babel_contents = read(babel_path).await?;
        let mut babel_rc: BabelRc = serde_json::from_slice(&babel_contents)?;

        let babel_validation = babel_rc.validate_config();
        let babel_parts: Vec<&str> = babel_validation.split("-").collect();
        let initial_section = babel_parts.get(0).expect("malformed validation data");

        match initial_section {
            &"no_preset" => {
                let default_rc = BabelRc::default_config();
                babel_rc.presets = default_rc.presets;
            },

            &"no_plugin" => {
                let default_rc = BabelRc::default_config();
                babel_rc.plugins = default_rc.plugins;
            },

            &"missing_runtime" | &"bad_runtime" | &"not_auto_runtime" => {
                let plugin_index_string = babel_parts.get(1).expect("malformed missing_runtime");
                let plugin_index = plugin_index_string.parse::<usize>()?;
                let mut babel_plugins = babel_rc.plugins.clone().unwrap();

                let offending_plugin = babel_plugins.get(plugin_index).expect("missing_runtime bad_index");
                if offending_plugin.is_array() == false {
                    return Err("invalid offending plugin".into())
                }

                let offending_plugin = offending_plugin.as_array().unwrap();
                let mut n_plugin: Vec<Value> = Vec::new();
                for config_opt in offending_plugin.iter() {
                    if config_opt.is_string() {
                        n_plugin.push(config_opt.clone());
                    } if config_opt.is_object() {
                        let mut config_object = config_opt.as_object().unwrap().clone();
                        config_object.insert(String::from("runtime"), "automatic".into());
                        n_plugin.push(config_object.into());
                    }
                }

                babel_plugins[plugin_index] = n_plugin.into();
                babel_rc.plugins = Some(babel_plugins);
            },

            &"no_react_preset" => {
                let mut babel_presets = babel_rc.presets.clone().unwrap();
                babel_presets.push("@babel/preset-react".into());
                babel_rc.presets = Some(babel_presets);
            },

            &"no_jsx_transform" => {
                let mut babel_plugins = babel_rc.plugins.clone().unwrap();
                let mut react_plugin: Vec<Value> = Vec::new();

                react_plugin.push("@babel/plugin-transform-react-jsx".into());
                react_plugin.push(json!({ "runtime": "automatic" }));
                babel_plugins.push(react_plugin.into());
                babel_rc.plugins = Some(babel_plugins);
            },

            &"valid" | _ => {}
        }
        
        let babel_content = serde_json::to_string(&babel_rc)?;
        write(babel_path, babel_content).await?;
    } else {
        //build a preset babelrc
        let default_rc = BabelRc::default_config();
        let default_rc_str = serde_json::to_string(&default_rc)?;
        write(babel_path, default_rc_str).await?;
    }

    //create the posthtml config
    let posthtml_config = PostHTMLConfig::init_config();
    let posthtml_config = serde_json::to_string(&posthtml_config)?;

    let posthtml_path = format!("./data/{}/.posthtmlrc", &process_id);
    write(posthtml_path, posthtml_config).await?;

    //now validate package json
    let package_loc = format!("./data/{}/package.json", &process_id);
    let package_path = Path::new(&package_loc);

    if package_path.exists() {
        let package_contents = read(package_path).await?;
        let mut package_obj: PackageJson = serde_json::from_slice(&package_contents)?;

        let validation_result = package_obj.validate_package_json();
        let babel_parts: Vec<&str> = validation_result.split("-").collect();
        let inital_selection = babel_parts.get(0).expect("malformed validation");

        match inital_selection {
           &"no_scripts" | &"no_build" => {
                let mut scripts: Map<String, Value> = Map::new();
                //check for an index .html
                let code_src = format!("./data/{}/src", &process_id);
                let code_src_path = Path::new(&code_src);

                if code_src_path.exists() == false {
                    let error_string = CompileProjectResult::create_error_message("no_src".into());
                    return Ok(socket_response(error_string, false, request_id));
                }

                let mut file_dir: Option<String> = None;
                for file in WalkDir::new(code_src_path).into_iter().filter_map(|file| file.ok()) {
                    if file.metadata().unwrap().is_file() {
                        let file_name = file.file_name().to_str();
                        if file_name.is_none() {
                            continue;
                        }

                        let file_name = file_name.unwrap();
                        if file_name == "index.html" {
                            let file_directory = file.into_path().into_os_string().into_string().expect("malformed_dir");
                            let file_directory = file_directory.replace("\\", "/");
                            let file_directory = file_directory.replace(&code_src, "");

                            file_dir = Some(file_directory);
                            break;
                        }
                    }
                }

                if file_dir.is_none() {
                    let error_string = CompileProjectResult::create_error_message("no_index".into());
                    return Ok(socket_response(error_string, false, request_id));
                }

                let file_dir = file_dir.unwrap();
                let file_dir = format!("src{}", &file_dir);

                let build_command = format!("parcel build {} --no-source-maps --public-url ./", file_dir);
                scripts.insert("build".into(), build_command.into());

                package_obj.scripts = Some(scripts);
           },
           
           &"valid" |  _ => {}
        }
        
        let package_contents = serde_json::to_string(&package_obj)?;
        write(package_path, package_contents).await?;
    } else {
        let error_string = CompileProjectResult::create_error_message("no_package".into());
        return Ok(socket_response(error_string, false, request_id));
    }

    //run the yarn commands
    let project_directory = format!("./data/{}", &process_id);
    let project_directory_path = canonicalize(&project_directory).await?;

    //clear the dist output
    let project_dist_dir = format!("./data/{}/dist", &process_id);
    let project_dist_path = Path::new(&project_dist_dir);

    if project_dist_path.exists() {
        remove_dir_all(&project_dist_dir).await?;
    }

    Command::new("yarn")
        .current_dir(&project_directory_path)
        .spawn()?
        .wait_with_output()
        .await?;

    Command::new("yarn")
        .current_dir(project_directory_path)
        .arg("build")
        .spawn()?
        .wait_with_output()
        .await?;

    let mut dist_paths = read_dir(&project_dist_dir).await?;
    let mut index_path: Option<String> = None;
    while let Some(path) = dist_paths.next_entry().await? {
        let dir_type = path.file_name();
        let dir_type = dir_type.to_str().unwrap();
        let dir_split: Vec<&str> = dir_type.split(".").collect();

        let name = dir_split[0];
        let extension = dir_split[1];
        if extension == "html" {
            let n_path = format!("./data/{}/dist/{}.{}", &process_id, &name, &extension);
            index_path = Some(n_path);
        }
    }

    if index_path.is_none() {
        let error_string = CompileProjectResult::create_error_message("malformed_dist".into());
        return Ok(socket_response(error_string, false, request_id));
    }

    
    //inline html and delete the folder
    let index_path = index_path.unwrap();
    let index_content = inline_file(index_path, Default::default())?;
    remove_dir_all(&project_directory).await?;    

    let output = CompileProjectResult::successful_message(index_content);
    Ok(socket_response(output, false, request_id))
}