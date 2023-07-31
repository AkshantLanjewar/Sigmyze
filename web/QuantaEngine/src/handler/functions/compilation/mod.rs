use std::env;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::io::Cursor;
use base64::Engine;
use inline_assets::inline_file;

use serde::{Deserialize, Serialize};
use tokio::fs::{read_dir, remove_dir_all};
use tokio::process::Command;
use tokio::sync::Mutex;

use crate::{handler::QuantaResult, data_store::{QuantaDataStore, set_store_value}};
use crate::handler::functions::compilation::types::CompileProjectResult;
use crate::handler::functions::compilation::utils::{validate_package_json, verify_babel};
use crate::handler::NPM_COMMAND;

use super::InternalStore;

mod utils;
mod types;

#[derive(Debug, Deserialize, Serialize)]
struct InitCompilationBody {
	input: Option<InternalStore>
}

pub async fn init_compilation(
	process_id: String,
	_node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: InitCompilationBody = serde_json::from_str(&function_data).expect("bad_body");
	let input = match body.input {
		Some(v) => v,
		None => return Err("no_input".into())
	};

	if input.socket_id.is_none() { return Err("no_socket_id".into()) }
	let input_socket_id = input.socket_id.unwrap();
	if input_socket_id != process_id { return Err("malformed_init".into()) }

	let compilation_key = format!("{}::compilation", process_id);
	set_store_value(compilation_key, "valid".into(), store).await;
	Ok("init".into())
}

#[derive(Debug, Deserialize, Serialize)]
struct CompileProjectBody {
	data: Option<String>
}

pub async fn compile_project(
	process_id: String,
	_node_id: String,
	function_data: String,
	_store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: CompileProjectBody = serde_json::from_str(&function_data).expect("bad_body");

	let zip_data = match body.data {
		Some(v) => v,
		None => return Err("no_zip_data".into())
	};

	let zip_data = zip_data.replace("\"", "");
	let zip_data = match base64::engine::general_purpose::STANDARD.decode(zip_data) {
		Ok(v) => v,
		Err(_) => return Err("bad_zip_data".into())
	};

	let zip_location = format!("./data/{}", &process_id);
	let zip_location = PathBuf::from(&zip_location);
	zip_extract::extract(
		Cursor::new(zip_data),
		&zip_location,
		true
	)
		.expect("bad_unzip");

	match verify_babel(&process_id).await {
		Ok(_) => (),
		Err(e) => return Err(e)
	}

	match validate_package_json(&process_id).await {
		Ok(_) => (),
		Err(e) => return Err(e)
	}

	//dist path
	let project_dist_dir = format!("./data/{}/dist", process_id);
	let project_dist_path = Path::new(&project_dist_dir);
	if project_dist_path.exists() {
		remove_dir_all(&project_dist_dir).await.unwrap();
	}

	//now compile and save
	let current_path = env::current_dir().unwrap();
	let current_path = current_path.as_path();
	env::set_current_dir(&zip_location).unwrap();

	//compile the projects after the directory change
	let install_output = Command::new(NPM_COMMAND)
		.spawn()
		.expect("failed_spawn")
		.wait_with_output()
		.await;
	
	match install_output {
		Ok(v) => v,
		Err(e) => return Err(e.to_string())
	};

	let build_output = Command::new(NPM_COMMAND)
		.arg("build")
		.spawn()
		.expect("failed_spawn")
		.wait_with_output()
		.await;

	match build_output {
		Ok(v) => v,
		Err(e) => return Err(e.to_string())
	};

	env::set_current_dir(current_path).unwrap();
	let mut dist_paths = read_dir(&project_dist_dir).await.unwrap();
	let mut index_path: Option<String> = None;

	while let Some(path) = dist_paths.next_entry().await.unwrap() {
		let dir_type = path.file_name();
		let dir_type = dir_type.to_str().unwrap();
		let dir_split: Vec<&str> = dir_type.split(".").collect();

		let name = dir_split[0];
		let extension = dir_split[1];
		if extension == "html" {
			let n_path = format!("./data/{}/dist/{}.{}", &process_id, &name, &extension);
			index_path = Some(n_path);
			break;
		}
	}

	if index_path.is_none() {
		return Err("malformed_dist".into())
	}

	//inline the html and delete the folder
	let index_path = index_path.unwrap();
	let index_content = match inline_file(index_path, Default::default()) {
		Ok(v) => v,
		Err(_) => return Err("failed_inline".into())
	};

	remove_dir_all(&zip_location).await.unwrap();
	let output = CompileProjectResult::successful_message(index_content);
	Ok(output)
}
