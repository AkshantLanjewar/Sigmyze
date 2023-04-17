use std::{path::{PathBuf, Path}, io::Cursor};

use actix_web::web;
use base64::{engine::general_purpose, Engine};
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use tokio::fs::{write, read};

use crate::handler::{Result, messages, functions::{socket_response}};

use super::types::BabelRc;

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

    //now validate package json
    let package_loc = format!("./data/{}/package.json", &process_id);
    let package_path = Path::new(&package_loc);

    if package_path.exists() {

    } else {
        
    }

    Ok(socket_response(String::from("change"), false, request_id))
}