use actix_web::web;
use basteh::{Basteh};
use serde::{Deserialize, Serialize};
use crate::handler::{functions::{types, Result, socket_response}, messages, socket_store::set_store_value};

#[derive(Debug, Deserialize, Serialize)]
struct LoopIndexData {
    #[serde(rename="loopId")]
    loop_id: Option<String>,
    index: Option<usize>,
    output: Option<types::InternalStore>,
}

pub async fn get_loop_index(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: LoopIndexData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    if body.loop_id.is_none() {
        return Err("requires a loop id".into())
    } if body.index.is_none() {
        return Err("requires index".into())
    } if body.output.is_none() {
        return Err("requires the output socket".into())
    }

    let loop_id = body.loop_id.unwrap();
    let loop_strings = data_store.get_range::<String>(&loop_id, 0, -1).await?;
    let index = body.index.unwrap();
    let value_string = &loop_strings[index];

    let output_socket = body.output.unwrap();
    let node_id = output_socket.node_id.unwrap();
    let socket_id = output_socket.socket_id.unwrap();

    set_store_value(&process_id, &node_id, &socket_id, &value_string, data_store).await;
    Ok(socket_response(String::from("success"), false, request_id))
}