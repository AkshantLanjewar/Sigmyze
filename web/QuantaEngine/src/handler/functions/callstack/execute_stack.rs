use actix_web::web;
use basteh::Basteh;

use crate::handler::{
    messages, 
    Result, 
    functions::{socket_response, load_process_id::{LoadProcessIdBody, load_process_id}}, 
    socket_store::set_store_value
};

use super::{types::ExecuteStackWrapperBody, call_stack_executor};

pub async fn execute_stack_wrapper(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    _data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: ExecuteStackWrapperBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    //create an internal data store
    let provider = basteh_memory::MemoryBackend::start_default();
    let internal_store = Basteh::build().provider(provider).finish();
    let internal_store = web::Data::new(internal_store);

    if body.preloaded_data.is_some() {
        let preloaded_data = body.preloaded_data.unwrap();
        for preload in preloaded_data.iter() {
            let preload = preload.clone();
            if preload.store.is_none() {
                continue;
            } if preload.value.is_none() {
                continue;
            }

            let preload_store = preload.store.unwrap();
            let preload_data = preload.value.unwrap();
            if preload_store.validate() == false {
                continue;
            }

            let node_id = preload_store.node_id.unwrap();
            let socket_id = preload_store.socket_id.unwrap();
            let preload_string = serde_json::to_string(&preload_data).unwrap();
            set_store_value(&process_id, &node_id, &socket_id, &preload_string, &internal_store).await;
        }
    }

    //set up the cache
    let organization_id = body.organization_id.expect("requires_organization_id");
    let load_process_body = LoadProcessIdBody {
        organization_id: Some(organization_id),
        quanta_id: Some(node_id)
    };

    //execute the function
    let load_process_str = serde_json::to_string(&load_process_body)?;
    load_process_id(request_id.clone(), process_id.clone(), load_process_str, &internal_store).await?;

    let edges = body.edges.expect("no_edges");
    let call_stack = body.call_stack.expect("requires_call_stack");
    
    let process_clone = process_id.clone();
    let schema = body.schema.expect("require_schema");

    tokio::spawn(async move {
        call_stack_executor::call_stack_executor(
            edges, 
            call_stack, 
            process_clone, 
            internal_store,
            schema
        ).await;
    });

    Ok(socket_response(String::from("background"), false, request_id))
}