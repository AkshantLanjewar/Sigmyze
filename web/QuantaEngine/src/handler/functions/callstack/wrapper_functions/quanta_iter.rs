use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{callstack::types::StackFunction, types::InternalStore, loop_functions::loop_index::{LoopIndexData, get_loop_index}};

pub async fn quanta_iter(
    process_id: String,
    stack: StackFunction,
    index: Option<usize>,
    loop_id: Option<String>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>
) {
    let node_id = stack.node_id.unwrap();
    if index.is_none() || loop_id.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let index = index.unwrap();
    let loop_id = loop_id.unwrap();
    let output_store = InternalStore {
        node_id: Some(node_id.clone()),
        socket_id: Some(node_id.clone())
    };

    let index_data = LoopIndexData {
        index: Some(index),
        loop_id: Some(loop_id),
        output: Some(output_store)
    };

    let index_string = serde_json::to_string(&index_data).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = get_loop_index(request_id, process_id, index_string, data_store).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}