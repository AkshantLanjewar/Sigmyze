use std::path::Path;
use serde_json::{json, Map, Value};
use tokio::fs::{read, write};
use walkdir::WalkDir;
use crate::handler::functions::compilation::types::{BabelRc, PackageJson, PostHTMLConfig};
use crate::handler::QuantaResult;

pub async fn verify_babel(process_id: &String) -> QuantaResult {
	let babel_location = format!("./data/{}/.babelrc", process_id);
	let babel_path = Path::new(&babel_location);

	if babel_path.exists() {
		let babel_contents = read(babel_path).await.unwrap();
		let mut babel_rc: BabelRc = match serde_json::from_slice(&babel_contents) {
			Ok(v) => v,
			Err(_) => BabelRc::default_config()
		};

		//validate the config
		let babel_valid = babel_rc.validate_config();
		let babel_parts: Vec<&str> = babel_valid.split("-").collect();
		let initial_selection = match babel_parts.get(0) {
			Some(v) => v,
			None => return Err("malformed_babel_str".into())
		};

		match initial_selection {
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
				let plugin_index = match plugin_index_string.parse::<usize>() {
					Ok(v) => v,
					Err(_) => return Err("bad_plugin_index".into())
				};

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

		let babel_content = serde_json::to_string(&babel_rc).unwrap();
		match write(babel_path, babel_content).await {
			Ok(_) => (),
			Err(_) => return Err("failed_babel_write".into())
		}
	} else {
		//build a preset babelrc
		let default_rc = BabelRc::default_config();
		let default_rc_str = serde_json::to_string(&default_rc).unwrap();
		match write(babel_path, default_rc_str).await {
			Ok(_) => (),
			Err(_) => return Err("failed_babel_write".into())
		}
	}

	//create the posthtml config
	let posthtml_config = PostHTMLConfig::init_config();
	let posthtml_config = serde_json::to_string(&posthtml_config).unwrap();

	let posthtml_path = format!("./data/{}/.posthtmlrc", &process_id);
	match write(posthtml_path, posthtml_config).await {
		Ok(_) => (),
		Err(_) => return Err("failed_posthtml_write".into())
	}

	Ok("done".into())
}

pub async fn validate_package_json(process_id: &String) -> QuantaResult {
	let package_loc = format!("./data/{}/package.json", process_id);
	let package_path = Path::new(&package_loc);

	if package_path.exists() {
		let package_contents = read(package_path).await.unwrap();
		let mut package_obj: PackageJson = match serde_json::from_slice(&package_contents) {
			Ok(v) => v,
			Err(_) => return Err("invalid_package_json".into())
		};

		let validation_result = package_obj.validate_package_json();
		let babel_parts: Vec<&str> = validation_result.split("-").collect();
		let initial_selection = match babel_parts.get(0) {
			Some(v) => v,
			None => return Err("malformed_validation".into())
		};

		match initial_selection {
			&"no_scripts" | &"no_build" => {
				let mut scripts: Map<String, Value> = Map::new();
				//check for an index .html
				let code_src = format!("./data/{}/src", process_id);
				let code_src_path = Path::new(&code_src);

				if code_src_path.exists() == false {
					return Err("no_src".into())
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
					return Err("no_index".into())
				}

				let file_dir = file_dir.unwrap();
				let file_dir = format!("src{}", &file_dir);

				let build_command = format!("parcel build {} --no-source-maps --public-url ./", file_dir);
				scripts.insert("build".into(), build_command.into());

				package_obj.scripts = Some(scripts);
			},

			&"valid" |  _ => {}
		}

		let package_contents = serde_json::to_string(&package_obj).unwrap();
		write(package_path, package_contents).await.unwrap();
	} else {
		return Err("no_package_json".into())
	}

	Ok("done".into())
}