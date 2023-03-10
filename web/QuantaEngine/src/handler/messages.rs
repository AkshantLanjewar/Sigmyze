use serde::{Deserialize, Serialize};

pub const SET_OUTPUT_VALUE: &str = "setOutputValue";
pub const GET_OUTPUT_VALUE: &str = "getOutputValue";

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
pub struct SetOutputValueData {
    pub value: Option<serde_json::Value>,

    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetOutputValueData {
    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SocketResponse {
    pub error: bool,
    pub message: String,

    #[serde(rename="requestId")]
    pub request_id: String
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetOutputValueResponse {
    pub value: serde_json::Value
}