use std::error;
use super::messages::{SocketResponse, self};

pub mod sdmx_data_parser;
pub mod loop_functions;

mod types;

pub type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

pub fn socket_response(msg: String, error: bool, request_id: String) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg,
        request_id: request_id
    }
}

