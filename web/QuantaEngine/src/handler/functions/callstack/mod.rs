pub mod types;
mod executor;
mod spawner;
mod utils;
mod request;
pub mod stack;

use std::sync::Arc;
use tokio::sync::{Mutex, oneshot};
use uuid::Uuid;
use crate::data_store::{QuantaDataStore, set_store_value};
use crate::handler::functions::callstack::spawner::{StackSpawner, Task};
use crate::handler::functions::callstack::types::{ExecuteStackWrapperBody, QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::functions::load::{load_process_id, LoadProcessIdBody};
use crate::handler::QuantaResult;

use self::request::{fetch_preload_data, delete_preload_data};

pub async fn execute_stack_wrapper(
	process_id: String,
	node_id: String,
	function_data: String,
	_store: &Arc<Mutex<QuantaDataStore>>,
) -> QuantaResult {
	let body: ExecuteStackWrapperBody = serde_json::from_str(&function_data).expect("bad_body");
	let inner_store = Arc::new(Mutex::new(QuantaDataStore::init()));

	//load the preloaded data
	if body.preloaded_data.is_some() {
		let preloaded_data_token = body.preloaded_data.unwrap();
		let preloaded_data = fetch_preload_data(preloaded_data_token.clone()).await;
		let preloaded_data = match preloaded_data {
			Some(v) => v,
			None => Vec::new()
		};

		//delete the entry within the database
		delete_preload_data(preloaded_data_token).await;
		for preload in preloaded_data.iter() {
			let preload_store = match &preload.store {
				Some(v) => v,
				None => continue
			};

			if preload_store.validate() == false {
				continue;
			}

			let preload_data = match &preload.value {
				Some(v) => serde_json::to_string(v).unwrap(),
				None => continue
			};

			let preload_node_id = preload_store.node_id.as_ref().unwrap();
			let preload_socket_id = preload_store.socket_id.as_ref().unwrap();
			let preload_key = format!("{}::{}::{}", &process_id, preload_node_id, preload_socket_id);
			set_store_value(preload_key, preload_data, &inner_store).await;
		}
	}

	//set up the cache
	let organization_id = match body.organization_id {
		Some(v) => v,
		None => return Err("no_organization_id".into())
	};

	let load_process_body = LoadProcessIdBody {
		organization_id: Some(organization_id),
		quanta_id: Some(node_id)
	};

	//execute the function
	let load_process_str = serde_json::to_string(&load_process_body).unwrap();
	let internal_node_id = Uuid::new_v4().to_string();
	match load_process_id(
		process_id.clone(),
		internal_node_id,
		load_process_str,
		&inner_store
	).await {
		Ok(_) => (),
		Err(e) => return Err(e)
	}

	let edges = match body.edges {
		Some(v) => v,
		None => return Err("no_edges".into())
	};

	let call_stack = match body.call_stack {
		Some(v) => v,
		None => return Err("no_call_stack".into())
	};

	let process_clone = process_id.clone();
	let schema = match body.schema {
		Some(v) => v,
		None => return Err("no_schema".into())
	};

	tokio::spawn(async move {
		callstack_task(
			edges,
			call_stack,
			process_clone,
			inner_store,
			schema
		).await;
	});

	Ok("background".into())
}

async fn callstack_task(
	edges: Vec<QuantaEdge>,
	call_stack: Vec<StackFunction>,
	process_id: String,
	store: Arc<Mutex<QuantaDataStore>>,
	schema: QuantaSchema
) {
	let spawner = StackSpawner::new();
	let (_, response) = oneshot::channel::<spawner::Task>();
	spawner.spawn(Task::StackFunction(
		edges,
		call_stack,
		process_id,
		store,
		schema
	));

	let _ = response.await;
}