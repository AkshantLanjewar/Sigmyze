use std::time::Duration;

use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use tokio::fs;

use crate::{handler::{messages, socket_response, Result,}};

#[derive(Debug, Deserialize, Serialize)]
struct UnloadProcessIdBody {
    #[serde(rename="processId")]
    process_id: Option<String>
}

pub async fn unload_process_id(
    request_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: UnloadProcessIdBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    let process_id = body.process_id.expect("requires process_id");
    let keys = data_store.get_range::<String>("keys", 0, -1).await?;
    let mut new_keys: Vec<String> = Vec::new();

    for key in keys.iter() {
        let cloned_key = key.clone();
        let split_process: Vec<&str> = cloned_key.split("_").collect();
        let split_process_id = split_process[0];

        if split_process_id == process_id {
            let store_val = data_store.get::<String>(key).await?;
            data_store.set_expiring(key, "", Duration::from_secs(5)).await?;
            if store_val.is_some() {
                let store_val = store_val.unwrap();
                if store_val == "file" {
                    let file_query = format!("./data/{}.bin", key);
                    fs::remove_file(file_query).await?;
                }
            }

            continue;
        }

        new_keys.push(String::from(key));
    }

    data_store.set("keys", new_keys).await.unwrap();
    Ok(socket_response(String::from("success"), false, request_id))
}