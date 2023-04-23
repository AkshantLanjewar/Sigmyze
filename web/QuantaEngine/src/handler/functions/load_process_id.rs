use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};

use crate::{handler::{messages, socket_response, Result,}};

#[derive(Debug, Deserialize, Serialize)]
pub struct LoadProcessIdBody {
    #[serde(rename="organizationId")]
    pub organization_id: Option<String>,

    #[serde(rename="quantaId")]
    pub quanta_id: Option<String>
}

pub async fn load_process_id(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: LoadProcessIdBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    let organization_id = body.organization_id.expect("requires an organization_id");
    let quanta_id = body.quanta_id.expect("requires a quanta_id");
    
    let cache_fmt = format!("{}::{}", organization_id, quanta_id);
    let proces_fmt = format!("{}::cache", process_id);
    let cached_fields: Vec<String> = Vec::new();

    //set the basteh fields
    data_store.set(process_id, cache_fmt).await.unwrap();
    data_store.set(proces_fmt, cached_fields).await.unwrap();

    Ok(socket_response(String::from("success"), false, request_id))
}