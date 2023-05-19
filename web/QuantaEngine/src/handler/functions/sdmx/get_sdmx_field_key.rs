use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use crate::{
    handler::{messages, functions::socket_response, Result, functions::types::{self, QuantaString}, 
    socket_store::{get_store_value, set_store_value}}, 
    sdmx_parser::sdmx_series::SDMXField
};

#[derive(Debug, Deserialize, Serialize)]
pub struct GetSDMXFieldKeyBody {
    pub input: Option<types::InternalStore>
}

pub async fn get_sdmx_field_key(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: GetSDMXFieldKeyBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.input.is_none() {
        return Err("requires input connection".into())
    }

    let input_socket = body.input.unwrap();
    let input_node_id = input_socket.node_id.unwrap();
    let input_socket_id = input_socket.socket_id.unwrap();

    let input_value = get_store_value(&process_id, &input_node_id, &input_socket_id, data_store).await?;
    let input_value: SDMXField = serde_json::from_value(input_value)?;
    
    let field_key = input_value.field_value;
    let field_string = QuantaString { value: field_key };
    let field_string = serde_json::to_string(&field_string)?;

    set_store_value(&process_id, &node_id, &String::from("field_key"), &field_string, data_store).await;
    Ok(socket_response(String::from("success"), false, request_id))
}