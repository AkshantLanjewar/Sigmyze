use std::{sync::{Arc}};
use futures_util::SinkExt;
use tokio::net::TcpStream;
use tokio::sync::Mutex;
use tokio_tungstenite::{WebSocketStream, tungstenite::{Result, Message}};

use crate::data_store::QuantaDataStore;

use self::{
    messages::SocketResponse, 
    base::{output_value::{get_output_value, set_output_value}, 
    socket_function::parse_socket_function
}};

mod messages;
mod base;
mod functions;

pub type QuantaResult = Result<String, String>;

#[cfg(debug_assertions)]
pub const SERVER_URL: &str = "http://localhost:3000";
#[cfg(not(debug_assertions))]
pub const SERVER_URL: &str = "https://sigmyze.com";

async fn handler(
    request: messages::SocketMessage,
    store: &Arc<Mutex<QuantaDataStore>>,
) -> QuantaResult {
    if request.socket_func.is_none() { return Err("no_socket_func".into()); }
    let function = request.socket_func.unwrap();

    if request.process_id.is_none() { return Err("no_pid".into()); }
    let process_id = request.process_id.unwrap();

    if request.socket_data.is_none() { return Err("no_data".into()); }
    let socket_data = request.socket_data.unwrap().to_string();

    let val: QuantaResult = match function.as_str() {
        "getOutputValue" => 
            get_output_value( process_id, socket_data, store).await,
        "setOutputValue" =>
            set_output_value(process_id, socket_data, store).await,
        "execute_function" =>
            parse_socket_function(process_id, socket_data, store).await,
        
        _ => Err("no_socket_func".into())
    };

    return val
}

pub async fn handle_text_msg(
    ws_stream: &mut WebSocketStream<TcpStream>, 
    store: &Arc<Mutex<QuantaDataStore>>,
    msg: &str
) -> Result<()> {
    let request: messages::SocketMessage = serde_json::from_str(msg).expect("bad_json");
    let request_id = request.request_id.as_ref().expect("no_request_id");
    let request_id = request_id.clone();

    let mut response = SocketResponse::new(request_id);
    let handler_res = handler(request, store).await;

    match handler_res {
        Ok(res) => {
            response.error = false;
            response.message = res;
        }

        Err(e) => { 
            response.error = true;
            response.message = e.into();
        }
    }

    let output_text = serde_json::to_string(&response).unwrap();
    ws_stream.send(Message::Text(output_text)).await?;

    Ok(())
}