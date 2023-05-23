use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{handler::QuantaResult, data_store::{QuantaDataStore, set_store_value}};

use super::InternalStore;

#[derive(Debug, Deserialize, Serialize)]
struct InitCompilationBody {
    input: Option<InternalStore>
}

pub async fn init_compilation(
    process_id: String,
    _node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: InitCompilationBody = serde_json::from_str(&function_data).expect("bad_body");
    let input = match body.input {
        Some(v) => v,
        None => return Err("no_input".into())
    };

    if input.socket_id.is_none() { return Err("no_socket_id".into()) }
    let input_socket_id = input.socket_id.unwrap();
    if input_socket_id != process_id { return Err("malformed_init".into()) }

    let compilation_key = format!("{}::compilation", process_id);
    set_store_value(compilation_key, "valid".into(), store).await;
    Ok("init".into())
}

#[derive(Debug, Deserialize, Serialize)]
struct CompileProjectBody {
    data: Option<String>
}

pub async fn compile_project(
    process_id: String,
    _node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: CompileProjectBody = serde_json::from_str(&function_data).expect("bad_body");

    let zip_data = match body.data {
        Some(v) => v,
        None => return Err("no_zip_data".into())
    };

    let zip_data = zip_data.replace("\"", "");
    

    Ok("change".into())
}