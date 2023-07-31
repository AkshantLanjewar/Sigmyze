use std::sync::Arc;
use js_sandbox::Script;
use serde_json::Value;
use serde_json::Value::Number;
use tokio::sync::Mutex;
use crate::data_store::{get_store_value, QuantaDataStore};
use crate::handler::functions::callstack::types::{QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::functions::callstack_handlers::{get_input_edge, QuantaValueResult};
use crate::handler::functions::callstack_handlers::types::QuantaSocket;
use crate::handler::functions::indicator::{AddIndicatorBody, BuildFieldsBody, StringToDateBody, UpdateIndicatorBody};
use crate::handler::functions::{InternalStore, QuantaFieldParam, QuantaString};

pub async fn string_to_date_wrapper(
	process_id: String,
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let input_field = match get_input_edge(&node_id, "in_string", edges) {
		Some(v) => v,
		None => return Err("no_input_field".into())
	};

	let input_field_id = input_field.source.as_ref().unwrap();
	if input_field.validate() == false || failed_nodes.contains(input_field_id) {
		return Err("invalid_input_field".into())
	}

	let input_node_id = input_field_id.clone();
	let input_socket_id = input_field.source_handle.unwrap();
	let input_key = format!("{}::{}::{}", &process_id, &input_node_id, &input_socket_id);

	let input_value = match get_store_value(input_key, store).await {
		Some(v) => v,
		None => return Err("no_input_value".into())
	};

	let input_string: QuantaString = match serde_json::from_str(&input_value) {
		Ok(v) => v,
		Err(_) => return Err("invalid_value".into())
	};

	let string_value = input_string.value;
	let date_code = r#"
        function date_func(a) {
            var date = Date.parse(a);

            if(isNan(date))
                return "nan";
            return date;
        }
    "#;

	let mut script = Script::from_string(date_code).unwrap();
	let timestamp: Value = script.call("date_func", &string_value).unwrap();

	let timestamp_object = match timestamp {
		Number(v) => StringToDateBody { timestamp: Some(v.as_i64().unwrap()) },
		serde_json::Value::String(_) => return Err("nan_obj".into()),
		_ => return Err("no_timestamp_object".into())
	};

	let value = serde_json::to_value(&timestamp_object).unwrap();
	Ok(value)
}

pub async fn update_indicator_callstack(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	let chart_edge = match get_input_edge(node_id, "chart_data", edges) {
		Some(v) => v,
		None => return Err("invalid_chart_edge".into())
	};

	let field_edge = match get_input_edge(node_id, "field", edges) {
		Some(v) => v,
		None => return Err("invalid_field_edge".into())
	};

	if chart_edge.validate() == false || field_edge.validate() == false {
		return Err("failed_input".into())
	}

	let chart_inputs = match stack.inputs.as_ref() {
		Some(v) => v,
		None => return Err("no_connected_inputs".into())
	};

	let mut update_mode: Option<String> = None;
	for chart_input in chart_inputs.iter() {
		if chart_input.id.is_none() {
			continue;
		}

		let stack_type = match chart_input.type_ref.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		let input_id = chart_input.id.as_ref().unwrap().clone();
		let type_id = match stack_type.type_id {
			Some(v) => v,
			None => continue
		};

		if input_id == "mode" {
			update_mode = Some(type_id);
		}
	}

	let update_mode = match update_mode {
		Some(v) => v,
		None => return Err("no_mode".into())
	};

	//create the execution body
	let chart_socket = InternalStore {
		node_id: chart_edge.source,
		socket_id: chart_edge.source_handle
	};

	let field_socket = InternalStore {
		node_id: field_edge.source,
		socket_id: field_edge.source_handle
	};

	let body = UpdateIndicatorBody { chart_input: Some(chart_socket), field_input: Some(field_socket), mode: Some(update_mode) };
	let value = serde_json::to_value(&body).unwrap();
	Ok(value)
}

pub async fn add_indicator_callstack(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	let chart_edge = match get_input_edge(node_id, "chart_data", edges) {
		Some(v) => v,
		None => return Err("invalid_chart_edge".into())
	};

	let field_edge = match get_input_edge(node_id, "field", edges) {
		Some(v) => v,
		None => return Err("invalid_field_edge".into())
	};

	if chart_edge.validate() == false || field_edge.validate() == false {
		return Err("failed_input".into())
	}

	let chart_socket = InternalStore {
		node_id: chart_edge.source,
		socket_id: chart_edge.source_handle
	};

	let field_socket = InternalStore {
		node_id: field_edge.source,
		socket_id: field_edge.source_handle
	};

	let body = AddIndicatorBody { chart_input: Some(chart_socket), field_input: Some(field_socket) };
	let value = serde_json::to_value(&body).unwrap();
	Ok(value)
}

pub async fn build_fields_callstack(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	schema: &QuantaSchema,
	failed_nodes: &Vec<String>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let schema_nodes = match schema.children.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_schema".into())
	};

	let mut dynamic_sockets: Vec<QuantaSocket> = Vec::new();
	for schema_node in schema_nodes.iter() {
		let schema_type = match schema_node.quanta_type.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		let schema_name = match schema_node.name.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		let schema_id = match schema_node.node_id.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		dynamic_sockets.push(QuantaSocket {
			type_ref: Some(schema_type),
			socket_name: Some(schema_name),
			socket_id: Some(schema_id)
		});
	}

	let mut field_params: Vec<QuantaFieldParam> = Vec::new();
	for socket in dynamic_sockets.iter() {
		let node_id = node_id.clone();
		let socket_id = match socket.socket_id.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		let edge = match get_input_edge(&node_id, &socket_id, edges) {
			Some(v) => v,
			None => continue
		};

		if edge.validate() == false {
			continue;
		}

		let internal_socket = InternalStore {
			node_id: edge.source,
			socket_id: edge.source_handle
		};

		let field_name = match socket.socket_name.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		let field_type = match socket.type_ref.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		field_params.push(QuantaFieldParam {
			field_name: Some(field_name),
			field_type: Some(field_type),
			socket: Some(internal_socket)
		});
	}

	//error check the field parameters
	for field_param in field_params.iter() {
		let socket = field_param.socket.as_ref().unwrap();
		let socket = socket.clone();

		let socket_node_id = socket.node_id.as_ref().unwrap();
		if failed_nodes.contains(socket_node_id) {
			return Err("failed_node".into())
		}
	}

	let body = BuildFieldsBody { fields: Some(field_params) };
	let value = serde_json::to_value(&body).unwrap();
	Ok(value)
}