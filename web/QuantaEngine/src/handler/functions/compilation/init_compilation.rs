use std::time::Duration;

use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};

use crate::handler::{Result, messages, functions::{socket_response, types}};

#[derive(Debug, Deserialize, Serialize)]
struct InitCompilationBody {
    input: Option<types::InternalStore>
}

pub async fn init_compilation(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: InitCompilationBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    let input = body.input.expect("function requires input field");
    let input_id = input.socket_id.expect("malformed input data");
    if input_id != process_id {
        return Err("malformed initialization request".into())
    }

    data_store.set_expiring(process_id, "valid", Duration::from_secs(60 * 30)).await?;
    Ok(socket_response(String::from("init"), false, request_id))
}