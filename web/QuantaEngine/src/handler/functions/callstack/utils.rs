use serde_json::Value;
use crate::handler::base::messages::ExecuteFunctionBody;

pub fn build_socket_function_body(
	node_id: String,
	function_id: String,
	function_data: Value,
	output_ids: Vec<String>
) -> ExecuteFunctionBody {
	return ExecuteFunctionBody {
		node_id: Some(node_id),
		function_id: Some(function_id),
		function_data: Some(function_data),
		output_ids: Some(output_ids),
	}
}