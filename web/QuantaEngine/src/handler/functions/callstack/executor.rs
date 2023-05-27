use std::sync::Arc;
use serde_json::{json};
use tokio::sync::Mutex;
use crate::data_store::QuantaDataStore;
use crate::handler::base::socket_function::parse_socket_function;
use crate::handler::functions::callstack::types::{QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::functions::callstack::utils::build_socket_function_body;
use crate::handler::functions::callstack_handlers::indicator::{add_indicator_callstack, build_fields_callstack, string_to_date_wrapper};
use crate::handler::functions::callstack_handlers::quanta_data::apply_data_rule_wrapper;
use crate::handler::functions::callstack_handlers::quanta_loop::{quanta_iter, quanta_loop_wrapper};
use crate::handler::functions::callstack_handlers::sdmx::get_sdmx_field_wrapper;
use crate::handler::functions::callstack_handlers::sdmx::mapper::sdmx_data_mapper_wrapper;
use crate::handler::functions::callstack_handlers::sdmx::parser::sdmx_data_parser_wrapper;
use crate::handler::QuantaResult;
use async_recursion::async_recursion;

#[async_recursion(?Send)]
pub async fn call_stack_executor(
	process_id: String,
	function: StackFunction,
	executed_nodes: Vec<String>,
	failed_nodes: Vec<String>,
	store: &Arc<Mutex<QuantaDataStore>>,
	schema: &QuantaSchema,
	edges: &Vec<QuantaEdge>,
	loop_id: Option<String>,
	index: Option<usize>
) -> QuantaResult {
	let dependencies = match function.dependencies.as_ref() {
		Some(v) => v.clone(),
		None => Vec::new()
	};

	for dependency in dependencies.iter() {
		if executed_nodes.contains(dependency) == false {
			return Err("dependency_unexpected".into())
		}

		if failed_nodes.contains(dependency) {
			return Err("dependency_failed".into())
		}
	}

	let node_id = match function.node_id.as_ref() {
		Some(v) => v,
		None => return Err("no_node_id".into())
	};

	if failed_nodes.contains(&node_id) || executed_nodes.contains(&node_id) {
		return Err("prev_exec".into())
	}

	let function_id = match function.function_id.as_ref() {
		Some(v) => v,
		None => return Err("no_function_id".into())
	};

	let mut output_ids: Vec<String> = Vec::new();
	let function = function.clone();
	let function_data = match function_id.as_str() {
		"add_indicator" => add_indicator_callstack(&function, edges).await,
		"build_fields" => build_fields_callstack(&function, edges, schema, &failed_nodes).await,
		"apply_data_rule" => apply_data_rule_wrapper(&function, edges, &failed_nodes).await,
		"string_to_date" => string_to_date_wrapper(process_id.clone(), &function, edges, &failed_nodes, store).await,
		"get_sdmx_field_value" => get_sdmx_field_wrapper(&function, edges, &failed_nodes).await,
		"get_sdmx_field_key" => get_sdmx_field_wrapper(&function, edges, &failed_nodes).await,
		"sdmx_data_parser" => sdmx_data_parser_wrapper(&function, edges, &failed_nodes, &mut output_ids).await,
		"sdmx_data_mapper" => sdmx_data_mapper_wrapper(&function, edges, &failed_nodes).await,
		"loop" => quanta_loop_wrapper(process_id.clone(), &function, edges, &failed_nodes, store, schema).await,
		"iter" => quanta_iter(&function, edges, &failed_nodes, loop_id, index).await,
		_ => Ok(json!(null))
	};

	let function_data = match function_data {
		Ok(v) => v,
		Err(e) => return Err(e)
	};

	let output_body = build_socket_function_body(
		node_id.clone(),
		function_id.into(),
		function_data,
		output_ids
	);

	let output_body_string = serde_json::to_string(&output_body).unwrap();
	match parse_socket_function(process_id.clone(), output_body_string, store).await {
		Ok(_) => (),
		Err(e) => return Err(e)
	}

	Ok("success".into())
}