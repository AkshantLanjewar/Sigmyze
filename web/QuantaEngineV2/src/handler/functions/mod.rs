use chrono::{DateTime, Utc, serde::ts_seconds};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use self::quanta_data::{DatasetField, ChartData};

pub mod load;
pub mod quanta_loop;
pub mod quanta_data;
pub mod indicator;
pub mod compilation;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct InternalStore {
    #[serde(rename="nodeId")]
    pub node_id: Option<String>,

    #[serde(rename="socketId")]
    pub socket_id: Option<String>
}

impl InternalStore {
    pub fn validate(&self) -> bool {
        if self.node_id.is_none() {
            return false
        } if self.socket_id.is_none() {
            return false
        }
        
        true
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaDate {
    #[serde(rename="internalDate", with = "ts_seconds")]
    pub internal_date: DateTime<Utc>
}

impl QuantaDate {
    pub fn new(date: DateTime<Utc>) -> Self {
        Self {
            internal_date: date
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaFieldType {
    #[serde(rename="groupId")]
    pub group_id: Option<String>,

    #[serde(rename="typeId")]
    pub type_id: Option<String>
}

impl QuantaFieldType {
    pub fn validate(&self) -> bool {
        if self.group_id.is_none() {
            return false
        } if self.type_id.is_none() {
            return false
        }

        true
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaFieldParam {
    #[serde(rename="fieldName")]
    pub field_name: Option<String>,

    #[serde(rename="fieldType")]
    pub field_type: Option<QuantaFieldType>,

    #[serde(rename="socket")]
    pub socket: Option<InternalStore>
}

impl QuantaFieldParam {
    pub fn validate(&self) -> bool { 
        if self.field_name.is_none() {
            return false
        } if self.field_type.is_none() {
            return false
        } if self.socket.is_none() {
            return false
        }

        let field_type = self.field_type.clone();
        let field_type = field_type.unwrap();
        if field_type.validate() == false {
            return false
        }

        let socket = self.socket.clone();
        let socket = socket.unwrap();
        if socket.validate() == false {
            return false
        }

        true
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaIndicator {
    #[serde(rename="field")]
    pub field: DatasetField,

    #[serde(rename="chartData")]
    pub chart_data: Vec<ChartData>,

    #[serde(rename="indicatorId")]
    pub indicator_id: Option<String>
}

impl QuantaIndicator {
    pub fn new(field: DatasetField, chart_data: Vec<ChartData>) -> Self {
        Self {
            field,
            chart_data,
            indicator_id: Some(Uuid::new_v4().to_string())
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaString {
    pub value: String
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct APIStatusMessage {
    pub error: bool,
    pub msg: String
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct GetIndicatorsResp {
    pub status: Option<APIStatusMessage>,
    pub indicators: Option<Vec<QuantaIndicator>>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct GetIndicatorLengthResp {
    pub status: Option<APIStatusMessage>,
    pub length: Option<i32>
}