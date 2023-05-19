use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{
    callstack::types::{StackFunction, QuantaEdge}, 
    types::InternalStore, 
    sdmx::get_sdmx_field_key::{GetSDMXFieldKeyBody, get_sdmx_field_key}
};

use super::utils::{get_input_edge, is_failed_node};

pub async fn get_sdmx_field_key_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>
) {
    let node_id = stack.node_id.unwrap();
    let input_field = get_input_edge(node_id.clone(), "sdmx_field".into(), edges);
    
    if input_field.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let input_field = input_field.unwrap();
    if input_field.validate() == false || is_failed_node(&input_field, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    }

    let input_store = InternalStore {
        node_id: input_field.source,
        socket_id: input_field.source_handle
    };

    let field_key_body = GetSDMXFieldKeyBody { input: Some(input_store) };
    let body_str = serde_json::to_string(&field_key_body).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = get_sdmx_field_key(request_id, node_id.clone(), process_id, body_str, data_store).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}