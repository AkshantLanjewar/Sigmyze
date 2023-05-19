use actix_web::web::Data;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::handler::functions::{
    callstack::{types::{StackFunction, QuantaEdge, QuantaSchema}, call_stack_executor::execute_call_stack_func}, 
    types::InternalStore, 
    loop_functions::{loop_load::{LoadLoopData, load_loop}, loop_unload::{UnloadLoopData, unload_loop}}
};

use super::utils::{is_failed_node};

#[derive(Debug, Deserialize, Serialize, Clone)]
struct LoopResponse {
    #[serde(rename="loopLength")]
    loop_length: Option<usize>
}

pub async fn quanta_loop(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>,
    schema: QuantaSchema
) {
    let node_id = stack.node_id.unwrap();
    let node_inputs = stack.inputs.unwrap();
    let connected_input = &node_inputs[0];

    let connected_edge = QuantaEdge {
        id: None,
        source: connected_input.id.clone(),
        source_handle: connected_input.name.clone(),
        target: None,
        target_handle: None
    };

    if is_failed_node(&connected_edge, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    }

    let request_id = Uuid::new_v4().to_string();
    let loop_id = Uuid::new_v4().to_string();

    let connected_internal = InternalStore {
        node_id: connected_input.id.clone(),
        socket_id: connected_input.name.clone()
    };

    let load_body = LoadLoopData { loop_id: Some(loop_id.clone()), connected: Some(connected_internal) };
    let load_body_string = serde_json::to_string(&load_body).unwrap();
    let resp = load_loop(
        request_id.clone(),
        process_id.clone(),
        load_body_string,
        data_store
    ).await;
    
    if resp.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    let resp = resp.unwrap();
    let resp_text = resp.message;
    let resp_obj: LoopResponse = serde_json::from_slice(resp_text.as_bytes()).unwrap();

    if resp_obj.loop_length.is_none() || stack.stack_thread.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let mut index = 0;
    let length = resp_obj.loop_length.unwrap();
    let child_stack_thread = stack.stack_thread.unwrap();

    while index < length {
        let process_id = process_id.clone();
        let mut loop_executed_nodes: Vec<String> = Vec::new();
        let mut loop_failed_nodes: Vec<String> = Vec::new();

        if index % 1000 == 0 {
            println!("on index {} of {}", index, length);
        }

        for child_stack in child_stack_thread.iter() {
            let child_stack = child_stack.clone();
            let process_id = process_id.clone();
            let schema = schema.clone();

            execute_call_stack_func(
                process_id,
                child_stack,
                child_stack_thread.clone(),
                edges,
                &mut loop_executed_nodes,
                &mut loop_failed_nodes,
                data_store,
                Some(index),
                Some(loop_id.clone()),
                schema
            ).await;
        }
        
        index+=1;
    }

    //now unload the loop
    let unload_loop_body = UnloadLoopData { loop_id: Some(loop_id) };
    let unload_loop_str = serde_json::to_string(&unload_loop_body).unwrap();
    let unload_res = unload_loop(request_id, unload_loop_str, data_store).await;

    if unload_res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}