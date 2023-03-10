use actix_web::{web};
use basteh::Basteh;
use super::messages::{self, SocketResponse};
use std::error;

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

fn socket_response(msg: String, error: bool, request_id: String) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg,
        request_id: request_id
    }
}

pub async fn set_output_value(
    request_id: String, 
    socket_data: String, 
    process_id: String, 
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: messages::SetOutputValueData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check socket data validity".into())
    };

    let node_id = match body.node_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define node_id in the socket data".into())
    };

    let socket_id = match body.socket_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define socket_id in the socket data".into())
    };

    let value = match body.value {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define value in the socket data".into())
    };

    let store_query = format!("{}:{}:{}", process_id, node_id, socket_id);
    data_store.set(store_query, value.to_string()).await.unwrap();

    Ok(socket_response(String::from("set_value"), false, request_id))
}

pub async fn get_output_value(
    request_id: String, 
    socket_data: String, 
    process_id: String, 
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: messages::GetOutputValueData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check socket data validity".into())
    };

    let node_id = match body.node_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define node_id in the socket data".into())
    };

    let socket_id = match body.socket_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define socket_id in the socket data".into())
    };

    let store_query = format!("{}:{}:{}", process_id, node_id, socket_id);
    let value_string = data_store.get::<String>(store_query).await.unwrap().unwrap();
    let value: serde_json::Value = serde_json::from_slice(value_string.as_bytes())?;

    let data = messages::GetOutputValueResponse { 
        value: value
    };

    Ok(socket_response(serde_json::to_string(&data)?, false, request_id))
}