use std::sync::Arc;
use tokio::sync::Mutex;
use crate::data_store::QuantaDataStore;
use crate::handler::functions::callstack::executor::call_stack_executor;
use crate::handler::functions::callstack::types::{QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::QuantaResult;

fn get_stack(node_id: &str, callstack: &Vec<StackFunction>) -> Option<StackFunction> {
	let mut collected_stack: Option<StackFunction> = None;
	for stack in callstack.iter() {
		let stack_node_id = match stack.node_id.as_ref() {
			Some(v) => v,
			None => continue
		};

		if stack_node_id.as_str() != node_id { continue; }
		collected_stack = Some(stack.clone());
	}

	return collected_stack
}

pub async fn stack_list_executor(
	edges: Vec<QuantaEdge>,
	callstack: Vec<StackFunction>,
	process_id: String,
	store: Arc<Mutex<QuantaDataStore>>,
	schema: QuantaSchema,
	loop_id: Option<String>,
	index: Option<usize>
) -> QuantaResult {
	let mut executed_nodes: Vec<String> = Vec::new();
	let mut failed_nodes: Vec<String> = Vec::new();

	for stack in callstack.iter() {
		let node_id = match stack.node_id.as_ref() {
			Some(v) => v.clone(),
			None => continue
		};

		if executed_nodes.contains(&node_id) || failed_nodes.contains(&node_id) {
			continue;
		}

		let dependencies = match stack.dependencies.as_ref() {
			Some(v) => v.clone(),
			None => Vec::new()
		};

		for dependency in dependencies.iter() {
			if executed_nodes.contains(dependency) || failed_nodes.contains(dependency) {
				continue;
			}

			let dependent_stack = match get_stack(dependency, &callstack) {
				Some(v) => v,
				None => continue
			};

			let process_id = process_id.clone();
			let dependent_node_id = dependent_stack.node_id.as_ref().unwrap();

			match call_stack_executor(
				process_id,
				dependent_stack.clone(),
				executed_nodes.clone(),
				failed_nodes.clone(),
				&store,
				&schema,
				&edges,
				loop_id.clone(),
				index
			).await {
				Ok(_) => executed_nodes.push(dependent_node_id.into()),
				Err(e) => {
					println!("{}", e);
					failed_nodes.push(dependent_node_id.into())
				}
			}
		}


		let process_id = process_id.clone();
		let _stack_func = stack.function_id.as_ref().unwrap();

		match call_stack_executor(
			process_id,
			stack.clone(),
			executed_nodes.clone(),
			failed_nodes.clone(),
			&store,
			&schema,
			&edges,
			loop_id.clone(),
			index
		).await {
			Ok(_) => executed_nodes.push(node_id.into()),
			Err(e) => {
				println!("{}", e.to_string());
				failed_nodes.push(node_id.into());
			}
		}
	}

	Ok("success".into())
}