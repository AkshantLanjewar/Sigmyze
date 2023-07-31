use crate::handler::functions::callstack::types::{QuantaEdge, StackFunction};
use crate::handler::functions::callstack_handlers::{get_input_edge, QuantaValueResult};
use crate::handler::functions::InternalStore;
use crate::handler::functions::quanta_data::ApplyDataRuleBody;

pub async fn apply_data_rule_wrapper(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>
) -> QuantaValueResult {
	let stack_inputs = match stack.inputs.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_stack_inputs".into())
	};

	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let mut selected_rule: Option<String> = None;
	for stack_input in stack_inputs.iter() {
		let quanta_type = match stack_input.type_ref.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		selected_rule = quanta_type.type_id;
	}

	if selected_rule.is_none() {
		return Err("no_selected_rule".into())
	}

	let chart_edge = match get_input_edge(&node_id, "chart_data", edges) {
		Some(v) => v,
		None => return Err("no_chart_edge".into())
	};

	if chart_edge.validate() == false {
		return Err("invalid_chart_edge".into())
	}

	let chart_edge_id = chart_edge.source.unwrap();
	if failed_nodes.contains(&chart_edge_id) {
		return Err("failed_node".into())
	}

	let chart_socket = InternalStore {
		node_id: Some(chart_edge_id),
		socket_id: chart_edge.source_handle
	};

	let mut data_body = ApplyDataRuleBody {
		data_rule: selected_rule.clone(),
		chart_socket: Some(chart_socket),
		date_socket: None
	};

	let selected_rule = selected_rule.unwrap();
	match selected_rule.as_str() {
		"is_projection" => {
			let date_edge = match get_input_edge(&node_id, "last_date", edges) {
				Some(v) => v,
				None => return Err("no_date_edge".into())
			};

			if date_edge.validate() == false {
				return Err("invalid_date_edge".into())
			}

			let date_node_id = date_edge.source.as_ref().unwrap().clone();
			if failed_nodes.contains(&date_node_id) {
				return Err("failed_date_node".into())
			}

			let date_socket = InternalStore {
				node_id: date_edge.source,
				socket_id: date_edge.source_handle
			};

			data_body.date_socket = Some(date_socket);
		}

		_ => return Err("no_rule".into())
	}

	let body_value = serde_json::to_value(&data_body).unwrap();
	Ok(body_value)
}