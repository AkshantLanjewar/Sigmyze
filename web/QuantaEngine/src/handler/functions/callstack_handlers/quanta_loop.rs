use std::sync::Arc;
use serde_json::json;
use tokio::sync::Mutex;
use uuid::Uuid;
use crate::data_store::QuantaDataStore;
use crate::handler::functions::callstack::stack::stack_list_executor;
use crate::handler::functions::callstack::types::{QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::functions::callstack_handlers::QuantaValueResult;
use crate::handler::functions::InternalStore;
use crate::handler::functions::quanta_loop::{load_loop, LoadLoopBody, LoadResponse, LoopIndexBody, unload_loop, UnloadLoopBody};

pub async fn quanta_loop_wrapper(
	process_id: String,
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>,
	store: &Arc<Mutex<QuantaDataStore>>,
	schema: &QuantaSchema,
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	let inputs = match stack.inputs.as_ref() {
		Some(v) => v,
		None => return Err("no_inputs".into())
	};

	if inputs.len() == 0 {
		return Err("no_inputs".into())
	}

	let connected_input = &inputs[0];
	let connected_input_node = match connected_input.id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	let connected_input_socket = match connected_input.name.as_ref() {
		Some(v) => v,
		None => return Err("no_socket_id".into())
	};

	if failed_nodes.contains(connected_input_node) {
		return Err("inputs_failed".into())
	}

	println!("here");
	let loop_id = Uuid::new_v4().to_string();
	let connected_internal = InternalStore {
		node_id: Some(connected_input_node.clone()),
		socket_id: Some(connected_input_socket.clone())
	};

	let load_body = LoadLoopBody { loop_id: Some(loop_id.clone()), connected: Some(connected_internal) };
	let body_str = serde_json::to_string(&load_body).unwrap();
	let load_res = match load_loop(
		process_id.clone(),
		node_id.clone(),
		body_str,
		store
	).await {
		Ok(v) => v,
		Err(e) => return Err(e)
	};

	let load_loop_response: LoadResponse = match serde_json::from_str(&load_res) {
		Ok(v) => v,
		Err(_) => return Err("invalid_load_resp".into())
	};

	let loop_length = load_loop_response.loop_length;
	let mut index = 0;
	let stack_thread = match stack.stack_thread.as_ref(){
		Some(v) => v,
		None => return Err("no_stack_thread".into())
	};

	println!("loop of length {}", &loop_length);
	while index < loop_length {
		let process_id = process_id.clone();
		let stack_thread = stack_thread.clone();
		let edges = edges.clone();
		let store = store.clone();
		let schema = schema.clone();
		let loop_id = loop_id.clone();

		if index % 1000 == 0 {
			println!("on index {} of {}", &index, &loop_length);
		}

		stack_list_executor(
			edges,
			stack_thread,
			process_id,
			store,
			schema,
			Some(loop_id),
			Some(index)
		).await?;
		index += 1;
	}

	//now we unload the loop
	let unload_loop_body = UnloadLoopBody { loop_id: Some(loop_id.clone()) };
	let unload_loop_str = serde_json::to_string(&unload_loop_body).unwrap();
	unload_loop(process_id.clone(), node_id.clone(), unload_loop_str, store)
		.await?;

	let blank_value = json!(null);
	Ok(blank_value)
}

pub async fn quanta_iter(
	stack: &StackFunction,
	_edges: &Vec<QuantaEdge>,
	_failed_nodes: &Vec<String>,
	loop_id: Option<String>,
	index: Option<usize>
) -> QuantaValueResult {
	let node_id = match stack.node_id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	let loop_id = match loop_id {
		Some(v) => v,
		None => return Err("no_loop_id".into())
	};

	let index = match index {
		Some(v) => v,
		None => return Err("no_index".into())
	};

	let output_store = InternalStore {
		node_id: Some(node_id.clone()),
		socket_id: Some(node_id.clone())
	};

	let index_data = LoopIndexBody {
		index: Some(index),
		loop_id: Some(loop_id),
		output: Some(output_store)
	};

	let value = serde_json::to_value(&index_data).unwrap();
	Ok(value)
}