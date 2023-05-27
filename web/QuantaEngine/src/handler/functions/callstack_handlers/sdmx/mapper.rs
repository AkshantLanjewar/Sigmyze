use crate::handler::functions::callstack::types::{QuantaEdge, StackFunction};
use crate::handler::functions::callstack_handlers::{get_input_edge, QuantaValueResult};
use crate::handler::functions::InternalStore;
use crate::handler::functions::sdmx::mapper::SDMXDataMapperData;

pub async fn sdmx_data_mapper_wrapper(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let connected_edge = match get_input_edge(&node_id, "sdmx_data", edges) {
		Some(v) => v,
		None => return Err("no_connected_edge".into())
	};

	if connected_edge.validate() == false {
		return Err("invalid_edge".into())
	}

	let connected_edge_id = connected_edge.source.as_ref().unwrap();
	if failed_nodes.contains(connected_edge_id) {
		return Err("failed_nodes".into())
	}

	let input_store = InternalStore {
		node_id: connected_edge.source,
		socket_id: connected_edge.source_handle
	};

	let input_body = SDMXDataMapperData { input: Some(input_store) };
	let value = serde_json::to_value(&input_body).unwrap();
	Ok(value)
}