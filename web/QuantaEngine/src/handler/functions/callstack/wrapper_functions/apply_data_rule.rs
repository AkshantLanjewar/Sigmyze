use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{
    callstack::types::{QuantaEdge, StackFunction}, 
    types::InternalStore, 
    apply_data_rule::{ApplyDataRuleBody, apply_data_rule}
};

use super::utils::{get_input_edge, is_failed_node};

pub async fn apply_data_rule_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>,
) {
    let stack_inputs = stack.inputs.unwrap();
    let node_id = stack.node_id.unwrap();
    let mut selected_rule: Option<String> = None;

    for stack_input in stack_inputs.iter() {
        let quanta_type = stack_input.type_ref.as_ref().unwrap();
        let quanta_type = quanta_type.clone();
        selected_rule = quanta_type.type_id;
    }

    if selected_rule.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let chart_edge = get_input_edge(node_id.clone(), "chart_data".into(), edges);
    if chart_edge.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let chart_edge = chart_edge.unwrap();
    if chart_edge.validate() == false || is_failed_node(&chart_edge, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    }

    let chart_socket = InternalStore {
        node_id: chart_edge.source,
        socket_id: chart_edge.source_handle
    };

    let mut data_body = ApplyDataRuleBody {
        data_rule: selected_rule.clone(),
        chart_socket: Some(chart_socket),
        date_socket: None
    };

    let selected_rule = selected_rule.unwrap();
    match selected_rule.as_str() {
        "is_projection" => {
            let date_edge = get_input_edge(node_id.clone(), "last_date".into(), edges);
            if date_edge.is_none() {
                failed_nodes.push(node_id);
                return;
            }

            let date_edge = date_edge.unwrap();
            if date_edge.validate() == false || is_failed_node(&date_edge, failed_nodes) {
                failed_nodes.push(node_id);
                return;
            }

            let date_socket = InternalStore {
                node_id: date_edge.source,
                socket_id: date_edge.source_handle
            };

            data_body.date_socket = Some(date_socket);
        }

        _ => {
            failed_nodes.push(node_id);
            return;
        }
    }

    let body_string = serde_json::to_string(&data_body).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = apply_data_rule(
        request_id, 
        node_id.clone(), 
        process_id, 
        body_string, 
        data_store
    ).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);

}