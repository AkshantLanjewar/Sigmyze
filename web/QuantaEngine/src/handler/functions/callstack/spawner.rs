use std::sync::Arc;
use tokio::runtime::Builder;
use tokio::sync::{mpsc, Mutex};
use tokio::task::LocalSet;
use uuid::Uuid;
use crate::data_store::QuantaDataStore;
use crate::handler::functions::callstack::types::{QuantaEdge, QuantaSchema, StackFunction};
use crate::handler::functions::load::{unload_process_id, UnloadProcessIdBody};
use derivative::Derivative;
use crate::handler::functions::callstack::stack::stack_list_executor;

#[derive(Derivative)]
#[derivative(Debug)]
pub enum Task {
	StackFunction(
		Vec<QuantaEdge>,
		Vec<StackFunction>,
		String,
		#[derivative(Debug="ignore")]
		Arc<Mutex<QuantaDataStore>>,
		QuantaSchema
	)
}

#[derive(Clone)]
pub struct StackSpawner {
	send: mpsc::UnboundedSender<Task>
}

impl StackSpawner {
	pub fn new() -> Self {
		let (send, mut recv) = mpsc::unbounded_channel::<Task>();

		let rt = Builder::new_multi_thread()
			.enable_all()
			.build()
			.unwrap();

		std::thread::spawn(move || {
			let local = LocalSet::new();

			local.spawn_local(async move {
				while let Some(new_task) = recv.recv().await {
					tokio::task::spawn_local(run_task(new_task));
				}
			});

			rt.block_on(local);
		});

		Self {
			send
		}
	}

	pub fn spawn(&self, task: Task) {
		self.send.send(task).expect("thread has closed");
	}
}

async fn run_task(task: Task) {
	match task {
		Task::StackFunction(
			edges,
			call_stack,
			process_id,
			store,
			schema
		) => {
			match stack_list_executor(
				edges,
				call_stack,
				process_id.clone(),
				store.clone(),
				schema,
				None,
				None
			).await {
				Ok(_) => (),
				Err(e) => println!("error in background loop -> {}", e)
			}

			//unload the stack
			let unload_body = UnloadProcessIdBody { process_id: Some(process_id.clone()) };
			let unload_body_str = serde_json::to_string(&unload_body).unwrap();
			let node_id = Uuid::new_v4().to_string();
			unload_process_id(
				process_id.clone(),
				node_id,
				unload_body_str,
				&store
			)
				.await
				.unwrap_or_default();
		}
	}
}