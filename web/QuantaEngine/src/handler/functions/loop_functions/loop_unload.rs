use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use crate::handler::{messages, functions::{Result, socket_response}};

#[derive(Debug, Deserialize, Serialize)]
struct UnloadLoopData {
    #[serde(rename="loopId")]
    loop_id: Option<String>,
}

pub async fn unload_loop(
    request_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: UnloadLoopData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    if body.loop_id.is_none() {
        return Err("requires a loop_id".into())
    }

    let loop_id = body.loop_id.unwrap();
    data_store.remove::<String>(&loop_id).await?;
    Ok(socket_response(String::from("removed"), false, request_id))
}