use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{callstack::types::{StackFunction, QuantaEdge}, types::InternalStore, add_indicator::{AddIndicatorBody, add_indicator}};

use super::utils::{get_input_edge, is_failed_node};

pub async fn add_indicator_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>,
) {
    let node_id = stack.node_id.unwrap();
    let chart_edge = get_input_edge(node_id.clone(), "chart_data".into(), edges);
    let field_edge = get_input_edge(node_id.clone(), "field".into(), edges);

    if field_edge.is_none() || chart_edge.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let chart_edge = chart_edge.unwrap();
    let field_edge = field_edge.unwrap();

    if chart_edge.validate() == false || is_failed_node(&chart_edge, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    } if field_edge.validate() == false || is_failed_node(&field_edge, failed_nodes) {
        failed_nodes.push(node_id);
        return;
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
    let body_str = serde_json::to_string(&body).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = add_indicator(
        request_id,
        node_id.clone(),
        process_id,
        body_str,
        data_store
    ).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}