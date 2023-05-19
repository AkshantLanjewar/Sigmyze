use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{
    callstack::types::{StackFunction, QuantaEdge}, 
    types::InternalStore, 
    sdmx::sdmx_data_mapper::{SDMXDataMapperData, sdmx_data_mapper}
};

use super::utils::{get_input_edge, is_failed_node};

pub async fn sdmx_data_mapper_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>
) {
    let node_id = stack.node_id.unwrap();
    let connected_edge = get_input_edge(node_id.clone(), "sdmx_data".into(), edges);

    if connected_edge.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let connected_edge = connected_edge.unwrap();
    if connected_edge.validate() == false || is_failed_node(&connected_edge, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    }


    let input_store = InternalStore {
        node_id: connected_edge.source,
        socket_id: connected_edge.source_handle
    };

    let input_body = SDMXDataMapperData { input: Some(input_store) };
    let input_string = serde_json::to_string(&input_body).unwrap();
    let node_id_clone = node_id.clone();
    let request_id = Uuid::new_v4().to_string();

    let resp = sdmx_data_mapper(
        request_id, 
        node_id_clone, 
        process_id, 
        input_string, 
        data_store
    ).await;

    if resp.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}