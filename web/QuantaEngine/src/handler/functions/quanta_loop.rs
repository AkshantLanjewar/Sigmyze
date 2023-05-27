use std::{sync::Arc};

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tokio::sync::Mutex;

use crate::{data_store::{QuantaDataStore, get_store_value, set_cache, pop_cache, get_cache, set_store_value}, handler::QuantaResult};

use super::InternalStore;

#[derive(Debug, Deserialize, Serialize)]
pub struct LoadLoopBody {
    #[serde(rename="loopId")]
    pub loop_id: Option<String>,

    pub connected: Option<InternalStore>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LoadResponse {
    #[serde(rename="loopLength")]
    pub loop_length: usize
}

pub async fn load_loop(
    process_id: String,
    _node_id: String, 
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: LoadLoopBody = serde_json::from_str(&function_data).expect("bad_body");

    let connected = match body.connected {
        Some(v) => {
            if v.validate() == false {
                return Err("invalid_connectd".into())
            }

            v
        },
        
        None => return Err("no_connected".into())
    };

    let loop_id = match body.loop_id {
        Some(v) => v,
        None => return Err("no_loop_id".into())
    };

    let connected_key = format!(
        "{}::{}::{}", 
        &process_id, 
        &connected.node_id.unwrap(), 
        &connected.socket_id.unwrap()
    );

    let connected_value_str = match get_store_value(connected_key, store).await {
        Some(v) => v,
        None => return Err("no_connected_value".into())
    };

    let connected_value: Value = match serde_json::from_str(&connected_value_str) {
        Ok(v) => v,
        Err(_) => return Err("connected_bad_json".into())
    };

    if connected_value.is_array() == false {
        return Err("not_array".into())
    }

    let connected_value = connected_value.as_array().unwrap();
    let loop_length = connected_value.len();
    let mut connected_cache: Vec<String> = Vec::new();

    for value in connected_value.iter() {
        let value_str = value.to_string();
        connected_cache.push(value_str);
    }

    set_cache(loop_id, connected_cache, store).await;
    let response = LoadResponse { loop_length: loop_length };
    let response_str = match serde_json::to_string(&response) {
        Ok(v) => v,
        Err(_) => return Err("load_resp_err".into())
    };

    Ok(response_str)
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UnloadLoopBody {
    #[serde(rename="loopId")]
    pub loop_id: Option<String>,
}

pub async fn unload_loop(
    _process_id: String,
    _node_id: String, 
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: UnloadLoopBody = serde_json::from_str(&function_data).expect("bad_body");
    let loop_id = match body.loop_id {
        Some(v) => v,
        None => return Err("no_loop_id".into())
    };

    pop_cache(loop_id, store).await;
    Ok("removed".into())
}

#[derive(Debug, Deserialize, Serialize)]
pub struct LoopIndexBody {
    #[serde(rename="loopId")]
    pub loop_id: Option<String>,
    pub index: Option<usize>,
    pub output: Option<InternalStore>,
}

pub async fn get_loop_index(
    process_id: String,
    _node_id: String, 
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: LoopIndexBody = serde_json::from_str(&function_data).expect("bad_body");

    let loop_id = match body.loop_id {
        Some(v) => v,
        None => return Err("no_loop_id".into())
    };

    let index = match body.index {
        Some(v) => v,
        None => return Err("no_index".into())
    };

    let output = match body.output {
        Some(v) => v,
        None => return Err("no_output".into())
    };

    if output.validate() == false { return Err("invalid_output".into()) }

    let cache = match get_cache(loop_id, store).await {
        Some(v) => v,
        None => return Err("no_loop".into())
    };
    
    if index > cache.len() { return Err("index_no_bound".into()) }
    let value = &cache[index];
    let value = value.clone();

    let node_id = output.node_id.unwrap();
    let socket_id = output.socket_id.unwrap();
    let output_key = format!("{}::{}::{}", process_id, node_id, socket_id);

    set_store_value(output_key, value, store).await;
    Ok("success".into())
}