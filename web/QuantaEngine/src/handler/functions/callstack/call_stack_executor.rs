use actix_web::web::{Data};
use async_recursion::async_recursion;
use basteh::Basteh;
use tokio::sync::oneshot;

use super::{
    types::{QuantaEdge, StackFunction, QuantaSchema}, 
    wrapper_functions::{
        sdmx_data_parser::sdmx_data_parser_wrapper, 
        sdmx_data_mapper::sdmx_data_mapper_wrapper, 
        quanta_loop::quanta_loop, 
        quanta_iter::{quanta_iter}, 
        get_sdmx_field_key::get_sdmx_field_key_wrapper, 
        get_sdmx_field_val::get_sdmx_field_val_wrapper, 
        string_to_date::string_to_date_wrapper, 
        build_fields::build_fields_wrapper, 
        apply_data_rule::apply_data_rule_wrapper, 
        add_indicator::add_indicator_wrapper
    }, 
    stack_spawner::{StackSpawner, Task}
};

#[async_recursion(?Send)]
pub async fn execute_call_stack_func(
    process_id: String,
    stack: StackFunction,
    call_stack: Vec<StackFunction>,
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>,
    index: Option<usize>,
    loop_id: Option<String>,
    schema: QuantaSchema
)  {
    let stack_clone = stack.clone();
    let function_id = stack.function_id.unwrap();

    //check for dependencies
    let dependencies = stack.dependencies.unwrap();
    for dependency in dependencies.iter() {
        let call_stack = call_stack.clone();
        let process_id = process_id.clone();
        let loop_id = loop_id.clone();
        let schema = schema.clone();

        //iter through the call stack
        let mut dependent_stack: Option<StackFunction> = None;
        for child_stack in call_stack.iter() {
            let child_node_id = child_stack.node_id.as_ref().unwrap();
            if child_node_id.as_str() != dependency.as_str() {
                continue;
            }

            dependent_stack = Some(child_stack.clone());
        }

        if dependent_stack.is_none() {
            continue;
        }

        execute_call_stack_func(
            process_id,
            dependent_stack.unwrap(),
            call_stack,
            edges,
            executed_nodes,
            failed_nodes,
            data_store,
            index,
            loop_id,
            schema
        ).await;
    }

    match function_id.as_str() {
        "sdmx_data_parser" => sdmx_data_parser_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store
        ).await,

        "sdmx_data_mapper" => sdmx_data_mapper_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store
        ).await,

        "loop" => quanta_loop(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store,
            schema
        ).await,

        "iter" => quanta_iter(
            process_id.clone(),
            stack_clone,
            index,
            loop_id,
            executed_nodes, 
            failed_nodes,
            data_store
        ).await,

        "get_sdmx_field_key" => get_sdmx_field_key_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store
        ).await,

        "get_sdmx_field_value" => get_sdmx_field_val_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store 
        ).await,

        "string_to_date" => string_to_date_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store 
        ).await,

        "build_fields" => build_fields_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store,
            schema 
        ).await,

        "apply_data_rule" => apply_data_rule_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store 
        ).await,

        "add_indicator" => add_indicator_wrapper(
            process_id.clone(),
            stack_clone, 
            edges, 
            executed_nodes, 
            failed_nodes,
            data_store
        ).await,

        _ => {}
    }
}

pub async fn call_stack_executor(
    edges: Vec<QuantaEdge>, 
    call_stack: Vec<StackFunction>,
    process_id: String,
    data_store: Data<Basteh>,
    schema: QuantaSchema
) {
    let spawner = StackSpawner::new();
    let (_, response) = oneshot::channel::<Task>();
    spawner.spawn(Task::StackFunction(edges, call_stack, process_id, data_store, schema));
    let _ = response.await;
}