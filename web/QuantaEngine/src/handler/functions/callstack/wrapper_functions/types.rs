use serde::{Deserialize, Serialize};

use crate::handler::functions::types::QuantaFieldType;

#[derive(Debug, Deserialize, Serialize)]
pub struct QuantaSocket {
    #[serde(rename="preloadedData")]
    pub socket_id: Option<String>,

    #[serde(rename="socketName")]
    pub socket_name: Option<String>,

    #[serde(rename="type")]
    pub type_ref: Option<QuantaFieldType>
}