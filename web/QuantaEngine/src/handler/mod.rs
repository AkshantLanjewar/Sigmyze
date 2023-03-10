use std::error;
use actix_ws::Message;
use basteh::Basteh;
use actix_web::{web};

use self::messages::SocketResponse;
mod messages;
mod socket_store;

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

fn socket_response(msg: String, error: bool) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg
    }
}

async fn parse_request(payload: &str, data_store: &web::Data<Basteh>) -> Result<messages::SocketResponse> {
    let request: messages::SocketMessage = match serde_json::from_str(payload) {
        Ok(request) => request,
        Err(_e) => return Err("JSON Parsing Error, check payload validity".into())
    };

    let function = match request.socket_func {
        Some(func) => func,
        None => return Err("Socket Parsing Error, please define what function to run".into())
    };

    let process_id = match request.process_id {
        Some(id) => id,
        None => return Err("Socket Parsing error, please define the process id".into())
    };

    let function_str = function.as_str();
    let socket_data = match request.socket_data {
        Some(val) => val.to_string(),
        None => return Err("SetOutputValue Error, please define the socket data".into())
    };

    let exec_value = match function_str {
        // { socketFunc: "setOutputValue", processId: "swag", socketData: { value: true, nodeId: "lol", socketId: "lol" } }
        messages::SET_OUTPUT_VALUE => socket_store::set_output_value(socket_data, process_id, data_store).await,
        // { socketFunc: "getOutputValue", processId: "swag", socketData: { nodeId: "lol", socketId: "lol" } }
        messages::GET_OUTPUT_VALUE => socket_store::get_output_value(socket_data, process_id, data_store).await,
        _ => Ok(socket_response(String::from("none"), false))
    };

    exec_value
}

pub async fn ws_connection(mut session: actix_ws::Session, mut msg_stream: actix_ws::MessageStream, data_store: web::Data<Basteh>) {
    log::info!("made connection");

    let close_reason = loop {
        match msg_stream.recv().await {
            Some(Ok(msg)) => {
                log::debug!("[DEBUG]: received msg {msg:?}");

                match msg {
                    Message::Text(text) => {
                        let bytes = &text.into_bytes();
                        let payload = std::str::from_utf8(bytes).unwrap();
                        let resp = match parse_request(payload, &data_store).await {
                            Ok(val) => val,
                            Err(e) => socket_response(e.to_string(), true)
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