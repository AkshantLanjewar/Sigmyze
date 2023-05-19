use actix_web::web::Data;
use basteh::Basteh;
use derivative::Derivative;
use tokio::{sync::mpsc, runtime::Builder, task::LocalSet};
use uuid::Uuid;

use crate::handler::functions::unload_process_id::{UnloadProcessIdBody, unload_process_id};

use super::{types::{QuantaEdge, StackFunction, QuantaSchema}, call_stack_executor::execute_call_stack_func};

#[derive(Derivative)]
#[derivative(Debug)]
pub enum Task {
    StackFunction(
        Vec<QuantaEdge>, 
        Vec<StackFunction>, 
        String, 
        #[derivative(Debug="ignore")]
        Data<Basteh>,
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

        let rt = Builder::new_current_thread()
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
            data_store, 
            schema
        ) => {
            let mut executed_nodes: Vec<String> = Vec::new();
            let mut failed_nodes: Vec<String> = Vec::new();

            for stack in call_stack.iter() {
                let stack = stack.clone();
                let process_id = process_id.clone();
                let schema = schema.clone();

                execute_call_stack_func(
                    process_id,
                    stack,
                    call_stack.clone(),
                    &edges,
                    &mut executed_nodes,
                    &mut failed_nodes,
                    &data_store,
                    None,
                    None,
                    schema
                ).await;
            }

            //unload the stack
            let unload_body = UnloadProcessIdBody { process_id: Some(process_id.clone()) };
            let unload_str = serde_json::to_string(&unload_body).unwrap();
            let request_id = Uuid::new_v4().to_string();
            let res = unload_process_id(request_id, unload_str, &data_store).await.unwrap();

            println!("{:?}", res);
        }
    }
}