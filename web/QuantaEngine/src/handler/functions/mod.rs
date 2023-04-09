use std::error;
use super::messages::{SocketResponse, self};

pub mod loop_functions;
pub mod sdmx;
pub mod types;
pub mod string_to_date;
pub mod build_fields;
pub mod apply_data_rule;
pub mod add_indicator;
pub mod unload_process_id;
pub mod load_process_id;

pub type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

pub fn socket_response(msg: String, error: bool, request_id: String) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg,
        request_id: request_id
    }
}

#[cfg(debug_assertions)]
pub const SERVER_URL: &str = "http://localhost:3000";
#[cfg(not(debug_assertions))]
pub const SERVER_URL: &str = "https://sigmyze.com";
