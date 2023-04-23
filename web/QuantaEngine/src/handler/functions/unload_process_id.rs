use std::{time::Duration};

use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use tokio::fs;

use crate::{handler::{messages, socket_response, Result,}};

use super::{SERVER_URL};

#[derive(Debug, Deserialize, Serialize)]
pub struct UnloadProcessIdBody {
    #[serde(rename="processId")]
    pub process_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
struct AddQuantaIndicatorsBody {
    #[serde(rename="processId")]
    process_id: String,

    #[serde(rename="organizationId")]
    organization_id: String,

    #[serde(rename="quantaId")]
    quanta_id: String,

    #[serde(rename="indicators")]
    indicators: Vec<String>
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
        let split_process: Vec<&str> = cloned_key.split("__").collect();
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

    //pop the cached results and append them to the database
    let cache_raw = data_store.get::<String>(&process_id).await?.unwrap();
    let cache_split = cache_raw.split("::").collect::<Vec<&str>>(); 
    if cache_split.len() != 2 {
        return Err("malformed cache data".into())
    }

    let organization_id = cache_split[0];
    let quanta_id = cache_split[1];

    let process_fmt = format!("{}::cache", &process_id);
    let cached_fields = data_store.get_range::<String>(&process_fmt, 0, -1).await?;

    let add_indicators_body = AddQuantaIndicatorsBody {
        process_id: process_id.clone(),
        organization_id: String::from(organization_id),
        quanta_id: String::from(quanta_id),
        indicators: cached_fields
    };

    let url = format!("{}/api/v2/quanta/add_indicator", SERVER_URL);
    let client = reqwest::Client::new();
    let _res = client.post(url)
        .json(&add_indicators_body)
        .send()
        .await?;

    data_store.set_expiring(process_fmt, "delete", Duration::from_secs(5)).await?;
    data_store.set_expiring(&process_id, "delete", Duration::from_secs(5)).await?;

    data_store.set("keys", new_keys).await.unwrap();
    Ok(socket_response(String::from("success"), false, request_id))
}