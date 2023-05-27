use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct GetOutputValueBody {
    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GetOutputValueResponse {
    pub value: serde_json::Value
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SetOutputValueBody {
    pub value: Option<serde_json::Value>,

    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ExecuteFunctionBody {
    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="functionId")]
    pub function_id: Option<String>,

    #[serde(rename="functionData")]
    pub function_data: Option<serde_json::Value>,

    #[serde(rename="outputIds")]
    pub output_ids: Option<Vec<String>>,
}