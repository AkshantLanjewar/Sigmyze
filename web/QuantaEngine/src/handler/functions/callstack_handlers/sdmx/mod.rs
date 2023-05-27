pub mod parser;
pub mod mapper;

use crate::handler::functions::callstack::types::{QuantaEdge, StackFunction};
use crate::handler::functions::callstack_handlers::{get_input_edge, QuantaValueResult};
use crate::handler::functions::InternalStore;
use crate::handler::functions::sdmx::GetSDMXFieldKeyBody;

pub async fn get_sdmx_field_wrapper(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let input_field = match get_input_edge(&node_id, "sdmx_field", edges) {
		Some(v) => v,
		None => return Err("missing_input_field".into())
	};

	let input_field_id = input_field.source.as_ref().unwrap();
	if input_field.validate() == false || failed_nodes.contains(input_field_id) {
		return Err("invalid_input_field".into())
	}

	let input_store = InternalStore {
		node_id: input_field.source,
		socket_id: input_field.source_handle
	};

	let field_key_body = GetSDMXFieldKeyBody { input: Some(input_store) };
	let value = serde_json::to_value(&field_key_body).unwrap();
	Ok(value)
}