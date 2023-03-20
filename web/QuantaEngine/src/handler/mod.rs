use std::{error};
use actix_ws::Message;
use basteh::Basteh;
use actix_web::{web};

use self::messages::SocketResponse;
mod messages;
mod socket_store;
mod socket_function;
mod functions;

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

fn socket_response(msg: String, error: bool, request_id: String) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg,
        request_id: request_id
    }
}

async fn parse_request(request: messages::SocketMessage, request_id: String, data_store: &web::Data<Basteh>) -> Result<messages::SocketResponse> {
    let function = match &request.socket_func {
        Some(func) => func.to_string(),
        None => return Err("Socket Parsing Error, please define what function to run".into())
    };

    let process_id = match &request.process_id {
        Some(id) => id.to_string(),
        None => return Err("Socket Parsing error, please define the process id".into())
    };

    let function_str = function.as_str();
    let socket_data = match &request.socket_data {
        Some(val) => val.to_string(),
        None => return Err("SetOutputValue Error, please define the socket data".into())
    };

    let exec_value = match function_str {
        // { socketFunc: "setOutputValue", processId: "swag", socketData: { value: true, nodeId: "lol", socketId: "lol" } }
        messages::SET_OUTPUT_VALUE => 
            socket_store::set_output_value(
                request_id,
                socket_data, 
                process_id, 
                data_store
            ).await,
        // { socketFunc: "getOutputValue", processId: "swag", socketData: { nodeId: "lol", socketId: "lol" } }
        messages::GET_OUTPUT_VALUE => 
            socket_store::get_output_value(
                request_id,
                socket_data,
                process_id, 
                data_store
            ).await,
        
        messages::SOCKET_FUNC =>
            socket_function::parse_function_request(
                request_id, 
                process_id, 
                socket_data,
                data_store 
            ).await,
        
        _ => Ok(socket_response(String::from("none"), false, request_id))
    };

    exec_value
}

pub async fn ws_connection(mut session: actix_ws::Session, mut msg_stream: actix_ws::MessageStream, data_store: web::Data<Basteh>) {
    log::info!("made connection");

    let close_reason = loop {
        match msg_stream.recv().await {
            Some(Ok(msg)) => {
                match msg {
                    Message::Text(text) => {
                        let bytes = &text.into_bytes();
                        let payload = std::str::from_utf8(bytes).unwrap();

                        let request: messages::SocketMessage = serde_json::from_str(payload).unwrap();
                        let request_id = request.clone().request_id.expect("requires request_id for message");

                        let resp = match parse_request(request.clone(), request_id.to_string(), &data_store).await {
                            Ok(val) => val,
                            Err(e) => socket_response(e.to_string(), true, request_id.to_string())
                        };

                        let out_text = serde_json::to_string(&resp).unwrap();
                        session.text(out_text).await.unwrap();
                    }

                    Message::Close(reason) => {
                        break reason;
                    }

                    Message::Continuation(_) => {
                        log::warn!("no support for continuation");
                    }

                    Message::Ping(_bytes) => {}
                    Message::Pong(_) => {}
                    Message::Nop => {}
                    Message::Binary(_binary) => {}
                }
            }

            _ => break None
        }
    };

    let _ = session.close(close_reason).await;
    log::info!("disconnected");
}