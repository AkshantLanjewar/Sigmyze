use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{handler::{QuantaResult, SERVER_URL}, data_store::{QuantaDataStore, init_cache, store_keys, delete_store_values, pop_cache, set_store_value, get_store_value}};

#[derive(Debug, Deserialize, Serialize)]
pub struct LoadProcessIdBody {
    #[serde(rename="organizationId")]
    pub organization_id: Option<String>,

    #[serde(rename="quantaId")]
    pub quanta_id: Option<String>
}

pub async fn load_process_id(
    process_id: String,
    _node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: LoadProcessIdBody = serde_json::from_str(&function_data).expect("bad_function_body");

    let organization_id = match body.organization_id {
        Some(v) => v,
        None => return Err("no_organization_id".into())
    };

    let quanta_id = match body.quanta_id {
        Some(v) => v,
        None => return Err("no_quanta_id".into())
    };

    let process_info_fmt = format!("{}::info", process_id);
    let process_info = format!("{}::{}", organization_id, quanta_id);
    set_store_value(process_info_fmt, process_info, store).await;

    let cache_fmt = format!("{}::cache", process_id);
    init_cache(cache_fmt, store).await;
    Ok("success".into())
}

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
    _process_id: String,
    _node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: UnloadProcessIdBody = serde_json::from_str(&function_data).expect("bad_function_body");

    let process_id = match body.process_id {
        Some(v) => v,
        None => return Err("no_process_id".into())
    };

    let store_keys = store_keys(store).await;
    let process_id_str = process_id.as_str();
    let mut kill_list: Vec<String> = Vec::new();

    for store_key in store_keys.iter() {
        let store_key_split = store_key.split("::").collect::<Vec<&str>>();
        if store_key_split.len() != 3 {
            continue;
        }

        let process_split = store_key_split[0];
        if process_id_str == process_split {
            kill_list.push(store_key.clone());
        }
    }

    //now we kill all the elements in the kill list
    delete_store_values(kill_list, store).await;

    //pop the cache and query it to the server
    let cache_fmt = format!("{}::cache", process_id);
    let cache = match pop_cache(cache_fmt, store).await {
        Some(v) => v,
        None => return Err("missing_cache".into())
    };

    let process_info_loc = format!("{}::info", process_id);
    let process_info = match get_store_value(process_info_loc, store).await {
        Some(v) => v,
        None => return Err("no_process_info".into())
    };

    let process_info_split = process_info.split("::").collect::<Vec<&str>>();
    if process_info_split.len() != 2 {
        return Err("bad_process_info".into())
    }

    let organization_id = process_info_split[0];
    let quanta_id = process_info_split[1];
    let add_indicators_body = AddQuantaIndicatorsBody {
        process_id: process_id.clone(),
        organization_id: organization_id.into(),
        quanta_id: quanta_id.into(),
        indicators: cache
    };

    let url = format!("{}/api/v2/quanta/add_indicator", SERVER_URL);
    let client = reqwest::Client::new();
    let res = client.post(url)
        .json(&add_indicators_body)
        .send()
        .await;

    let res = match res {
        Ok(r) => r.status(),
        Err(err) => return Err(err.to_string())
    };

    if res != 200 { return Err("bad_request".into()) }

    Ok("success".into())
}