use actix_web::web::Data;
use basteh::Basteh;
use js_sandbox::Script;
use uuid::Uuid;

use crate::handler::{
    functions::{callstack::types::{StackFunction, QuantaEdge}, 
    string_to_date::{StringToDateBody, string_to_date}}, 
    socket_store::get_store_value
};

use super::utils::{get_input_edge, is_failed_node};

pub async fn string_to_date_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>
) {
    let node_id = stack.node_id.unwrap();
    let input_field = get_input_edge(node_id.clone(), "in_string".into(), edges);
    
    if input_field.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let input_field = input_field.unwrap();
    if input_field.validate() == false || is_failed_node(&input_field, failed_nodes) {
        failed_nodes.push(node_id);
        return;
    }

    let input_node_id = input_field.source.unwrap();
    let input_socket_id = input_field.source_handle.unwrap();
    let input_value = get_store_value(&process_id, &input_node_id, &input_socket_id, data_store).await;

    if input_value.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    let input_value = input_value.unwrap();
    if input_value.is_string() == false {
        failed_nodes.push(node_id);
        return;
    }

    let input_value = input_value.as_str().unwrap();
    let date_code = r#"
        function date_func(a) { 
            var date = Date.parse(a);

            if(isNan(date))
                return 90258;
            return date;
        }
    "#;

    let mut script = Script::from_string(date_code).unwrap();
    let timestamp: i64 = script.call("date_func", &input_value).unwrap();
    let timestamp_object = StringToDateBody { timestamp: Some(timestamp) };
    
    let timestamp_str = serde_json::to_string(&timestamp_object).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = string_to_date(request_id, node_id.clone(), process_id, timestamp_str, data_store).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}