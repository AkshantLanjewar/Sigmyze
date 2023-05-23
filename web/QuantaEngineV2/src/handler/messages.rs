use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct SocketMessage {
    #[serde(rename="socketFunc")]
    pub socket_func: Option<String>,

    #[serde(rename="requestId")]
    pub request_id: Option<String>,

    #[serde(rename="socketData")]
    pub socket_data: Option<serde_json::Value>,

    #[serde(rename="processId")]
    pub process_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SocketResponse {
    pub error: bool,
    pub message: String,

    #[serde(rename="requestId")]
    pub request_id: String
}

impl SocketResponse {
    pub fn new(id: String) -> Self {
        Self {
            request_id: id,
            error: false,
            message: String::from("")
        }
    }
}