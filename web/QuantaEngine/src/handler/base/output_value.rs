use std::sync::{Arc};
use tokio::sync::Mutex;

use crate::{data_store::{QuantaDataStore, get_store_value, set_store_value}, handler::QuantaResult};

use super::messages::{self, GetOutputValueResponse, SetOutputValueBody};

pub async fn get_output_value(
    process_id: String,
    socket_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: messages::GetOutputValueBody = serde_json::from_str(&socket_data).expect("bad_body");

    if body.node_id.is_none() { return Err("no_node_id".into()) }
    let node_id = body.node_id.unwrap();

    if body.socket_id.is_none() { return Err("no_socket_id".into()) }
    let socket_id = body.socket_id.unwrap();

    let key = format!("{}::{}::{}", &process_id, &node_id, &socket_id);
    let value_str = get_store_value(key, store).await;

    if value_str.is_none() { return Err("no_value".into()) }
    let value_str = value_str.unwrap();
    let value = serde_json::from_str(&value_str).unwrap();

    let response = GetOutputValueResponse { value: value };
    let response_str = serde_json::to_string(&response).expect("malformed");

    Ok(response_str)
}

pub async fn set_output_value(
    process_id: String,
    socket_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: SetOutputValueBody = serde_json::from_str(&socket_data).expect("bad_body");
    
    let node_id = match body.node_id {
        Some(v) => v,
        None => return Err("no_node_id".into())
    };
    
    let socket_id = match body.socket_id {
        Some(v) => v,
        None => return Err("no_socket_id".into())
    };

    let value = match body.value {
        Some(v) => v,
        None => return Err("no_value".into())
    };

    let key = format!("{}::{}::{}", &process_id, &node_id, &socket_id);
    set_store_value(key, value.to_string(), store).await;
    Ok("set_value".into())
}