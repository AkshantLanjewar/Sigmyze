use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use crate::handler::{messages, socket_store::get_store_value, functions::{types, Result, socket_response}};

use super::loop_response;

#[derive(Debug, Deserialize, Serialize)]
struct LoadLoopData {
    #[serde(rename="loopId")]
    loop_id: Option<String>,
    connected: Option<types::InternalStore>,
}

pub async fn load_loop(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: LoadLoopData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    if body.connected.is_none() {
        return Err("requires connected data".into())
    } if body.loop_id.is_none() {
        return Err("requires the loop id".into())
    }

    let connected = body.connected.unwrap();
    let connected_node_id = connected.node_id.expect("requires a node id");
    let connected_socket_id = connected.socket_id.expect("requires a socket id");
    let connected_value = get_store_value(
        &process_id, 
        &connected_node_id, 
        &connected_socket_id, 
        data_store
    ).await?;

    if connected_value.is_array() == false {
        return Err("data provided is not a vector".into())
    }

    let connected_value = connected_value.as_array().unwrap();
    let loop_length = connected_value.len();

    let mut connected_bytes: Vec<String> = Vec::new();
    for value in connected_value.iter() {
        let value_string = value.to_string();
        connected_bytes.push(value_string);
    }

    //store the vector in basteh, and return the length of the vector back to the client
    let loop_id = body.loop_id.unwrap();
    data_store.set(loop_id, connected_bytes).await.unwrap();

    let response = loop_response::LoadResponse::new(loop_length);
    let response_str = serde_json::to_string(&response)?;

    Ok(socket_response(String::from(response_str), false, request_id))
}