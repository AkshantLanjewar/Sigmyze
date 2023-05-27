use serde_json::Value;
use crate::handler::functions::callstack::types::QuantaEdge;

pub mod indicator;
mod types;
pub mod quanta_data;
pub mod sdmx;
pub mod quanta_loop;

pub type QuantaValueResult = Result<Value, String>;

pub fn get_input_edge(node_id: &str, socket_id: &str, edges: &Vec<QuantaEdge>) -> Option<QuantaEdge> {
	let mut input_edge: Option<QuantaEdge> = None;
	for edge in edges.iter() {
		if edge.validate() == false {
			continue;
		}

		let edge_target = match edge.target.as_ref() {
			Some(v) => v,
			None => continue
		};

		let edge_socket = match edge.target_handle.as_ref() {
			Some(v) => v,
			None => continue
		};

		if edge_target.as_str() == node_id && edge_socket.as_str() == socket_id {
			input_edge = Some(edge.clone());
		}
	}

	input_edge
}