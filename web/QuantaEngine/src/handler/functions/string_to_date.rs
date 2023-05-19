use actix_web::web;
use basteh::Basteh;
use chrono::{Utc, TimeZone};
use serde::{Deserialize, Serialize};

use crate::handler::{messages, socket_response, Result, socket_store::set_store_value};

use super::types::QuantaDate;

#[derive(Debug, Deserialize, Serialize)]
pub struct StringToDateBody {
    pub timestamp: Option<i64>
}

pub async fn string_to_date(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: StringToDateBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.timestamp.is_none() {
        return Err("requires input connection".into())
    }

    let timestamp = body.timestamp.unwrap();
    let datetime = Utc.timestamp_millis_opt(timestamp).unwrap();
    
    let socket_object = QuantaDate::new(datetime);
    let socket_object_str = serde_json::to_string(&socket_object).unwrap();
    set_store_value(&process_id, &node_id, &String::from("out_date"), &socket_object_str, data_store).await;

    Ok(socket_response(String::from("converted"), false, request_id))
}