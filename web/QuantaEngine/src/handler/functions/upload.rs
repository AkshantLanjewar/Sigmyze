use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{handler::QuantaResult, data_store::{QuantaDataStore, set_store_value}};

use super::callstack::request::{fetch_preload_data, delete_preload_data};

#[derive(Debug, Deserialize, Serialize)]
pub struct UploadDataBody {
    #[serde(rename="storageToken")]
    pub storage_token: Option<String>
}

pub async fn upload_data(
    process_id: String,
	node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>,
) -> QuantaResult {
    let body: UploadDataBody = serde_json::from_str(&function_data).expect("bad_body");
    let storage_token = match body.storage_token {
        Some(v) => v,
        None => return Err("no_token".into())
    };

    //now we load the data that is stored on the server
    let upload_data = fetch_preload_data(storage_token.clone()).await;
    let upload_data = match upload_data {
        Some(v) => v,
        None => Vec::new()
    };

    //delete the entry within the database
    delete_preload_data(storage_token).await;
    for uploaded_data in upload_data.iter() {
        let upload_store = match &uploaded_data.store {
            Some(v) => v,
            None => continue
        };

        if upload_store.validate() == false {
            continue;
        }

        let preload_data = match &uploaded_data.value {
            Some(v) => serde_json::to_string(v).unwrap(),
            None => continue
        };

        let preload_node_id = upload_store.node_id.as_ref().unwrap();
        let preload_socket_id = upload_store.socket_id.as_ref().unwrap();
        let preload_key = format!("{}::{}::{}", &process_id, preload_node_id, preload_socket_id);
        set_store_value(preload_key, preload_data, &store).await;
    }

    Ok("success".into())
}