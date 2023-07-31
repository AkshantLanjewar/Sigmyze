pub mod parser;
pub mod mapper;

use std::sync::Arc;
use tokio::sync::Mutex;
use crate::data_store::{get_store_value, QuantaDataStore, set_store_value};
use crate::handler::functions::{InternalStore, QuantaString};
use crate::handler::QuantaResult;
use serde::{Deserialize, Serialize};
use crate::sdmx_parser::types::SDMXField;

#[derive(Debug, Deserialize, Serialize)]
pub struct GetSDMXFieldKeyBody {
	pub input: Option<InternalStore>
}

pub async fn get_sdmx_field_key(
	process_id: String,
	node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: GetSDMXFieldKeyBody = serde_json::from_str(&function_data).expect("bad_body");

	let input = match body.input {
		Some(v) => v,
		None => return Err("no_input".into())
	};

	if input.validate() == false {
		return Err("invalid_input".into())
	}

	let input_node_id = input.node_id.unwrap();
	let input_socket_id = input.socket_id.unwrap();
	let input_key = format!("{}::{}::{}", &process_id, &input_node_id, &input_socket_id);

	let input_value = match get_store_value(input_key, store).await {
		Some(v) => v,
		None => return Err("no_input_value".into())
	};

	let input_value: SDMXField = match serde_json::from_str(&input_value) {
		Ok(v) => v,
		Err(_) => return Err("invalid_input_value".into())
	};

	let field_key = input_value.field_value;
	let field_string = QuantaString { value: field_key };
	let field_string = serde_json::to_string(&field_string).unwrap();

	let field_key = format!("{}::{}::{}", &process_id, &node_id, "field_key");
	set_store_value(field_key, field_string, store).await;
	Ok("success".into())
}

pub async fn get_sdmx_field_value(
	process_id: String,
	node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: GetSDMXFieldKeyBody = serde_json::from_str(&function_data).expect("bad_body");

	let input = match body.input {
		Some(v) => v,
		None => return Err("no_input".into())
	};

	if input.validate() == false {
		return Err("invalid_input".into())
	}

	let input_node_id = input.node_id.unwrap();
	let input_socket_id = input.socket_id.unwrap();
	let input_key = format!("{}::{}::{}", &process_id, &input_node_id, &input_socket_id);

	let input_value = match get_store_value(input_key, store).await {
		Some(v) => v,
		None => return Err("no_input_value".into())
	};

	let input_value: SDMXField = match serde_json::from_str(&input_value) {
		Ok(v) => v,
		Err(_) => return Err("invalid_input_value".into())
	};

	let field_val = input_value.field_documentation;
	let field_string = QuantaString { value: field_val };
	let field_string = serde_json::to_string(&field_string).unwrap();

	let field_key = format!("{}::{}::{}", &process_id, &node_id, "field_value");
	set_store_value(field_key, field_string, store).await;
	Ok("success".into())
}