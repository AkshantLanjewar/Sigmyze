use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct InternalStore {
    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}