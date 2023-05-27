use std::{fmt::Debug, sync::Arc};

use serde::{Deserialize, Serialize};
use chrono::{serde::ts_seconds, DateTime, Utc};
use tokio::sync::Mutex;

use crate::{handler::QuantaResult, data_store::{QuantaDataStore, get_store_value, set_store_value}};

use super::{InternalStore, QuantaDate};

#[derive(Deserialize, Serialize, Clone)]
pub struct ChartData {
    #[serde(with = "ts_seconds", rename="xValue")]
    pub x_val: DateTime<Utc>,

    #[serde(rename = "yValue")]
    pub y_val: f32,

    #[serde(rename = "isProjection")]
    pub is_projection: bool
}

impl ChartData {
    pub fn new(x_val: DateTime<Utc>, y_val: f32) -> Self {
        Self {
            x_val: x_val,
            y_val: y_val,
            is_projection: false
        }
    }
}

impl Debug for ChartData {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ChartData")
            .field("x", &self.x_val)
            .field("y", &self.y_val)
            .finish()
    }
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct DatasetFieldItem {
    #[serde(rename = "fieldKey")]
    pub field_key: String,

    #[serde(rename = "fieldType")]
    pub field_type: String,

    #[serde(rename = "stringField")]
    pub string_field: Option<String>,

    #[serde(rename = "dateField")]
    pub date_field: Option<DateTime<Utc>>
}

impl DatasetFieldItem {
    fn init(field_key: String, field_type: String) -> Self {
        Self {
            field_key,
            field_type,
            string_field: None,
            date_field: None
        }
    }
    
    pub fn new(
        field_key: String, 
        field_type: String, 
        string_field: Option<String>, 
        date_field: Option<DateTime<Utc>>
    ) -> Result<Self, String> {
        let new_item = &mut DatasetFieldItem::init(field_key, field_type);
        if new_item.field_type == "string" {
            let string_field = string_field.expect("requires the string field for the string type");
            new_item.string_field = Some(string_field);
        } if new_item.field_type == "date" {
            let date_field = date_field.expect("Date type requires date field");
            new_item.date_field = Some(date_field);
        }

        Ok(new_item.clone())
    }
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct DatasetField {
    #[serde(rename = "datasetFields")]
    pub dataset_fields: Vec<DatasetFieldItem>
}

impl DatasetField {
    pub fn new() -> Self {
        Self {
            dataset_fields: Vec::new()
        }
    }
}

//implement the apply data rule function
#[derive(Debug, Deserialize, Serialize)]
pub struct ApplyDataRuleBody {
    #[serde(rename="dataRule")]
    pub data_rule: Option<String>,

    #[serde(rename="dateSocket")]
    pub date_socket: Option<InternalStore>,

    #[serde(rename="chartSocket")]
    pub chart_socket: Option<InternalStore>
}

pub async fn apply_data_rule(
    process_id: String,
    node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: ApplyDataRuleBody = serde_json::from_str(&function_data).expect("bad_body");

    let data_rule = match body.data_rule {
        Some(v) => v,
        None => return Err("no_data_rule".into())
    };

    let chart_socket = match body.chart_socket {
        Some(v) => v,
        None => return Err("no_chart_socket".into())
    };

    if chart_socket.validate() == false {
        return Err("invalid_socket".into())
    }

    let chart_node_id = chart_socket.node_id.unwrap();
    let chart_socket_id = chart_socket.socket_id.unwrap();
    let chart_socket_key = format!("{}::{}::{}", process_id, chart_node_id, chart_socket_id);

    let chart_value = match get_store_value(chart_socket_key, store).await {
        Some(v) => v,
        None => return Err("no_chart_value".into())
    };

    let chart_data: Vec<ChartData> = serde_json::from_str(&chart_value).unwrap();
    let mut new_chart_data: Vec<ChartData> = Vec::new();

    match data_rule.as_str() {
        "is_projection" => {
            let date_socket = match body.date_socket {
                Some(v) => v,
                None => return Err("no_date_socket".into())
            };

            if date_socket.validate() == false { return Err("invalid_date_socket".into()) }

            let date_node_id = date_socket.node_id.unwrap();
            let date_socket_id = date_socket.socket_id.unwrap();
            let date_key = format!("{}::{}::{}", process_id, date_node_id, date_socket_id);

            let date_value = match get_store_value(date_key, store).await {
                Some(v) => v,
                None => return Err("no_date_value".into())
            };

            let date_value: QuantaDate = match serde_json::from_str(&date_value) {
                Ok(v) => v,
                Err(_) => return Err("invalid_date_value".into())
            };

            let date = date_value.internal_date;
            for point in chart_data.iter() {
                let mut point = point.clone();
                let point_date = point.x_val;

                if point_date > date {
                    point.is_projection = true;
                }

                new_chart_data.push(point);
            }
        }
        
        _ => return Err("no_rule_selected".into())
    }

    let data_str = serde_json::to_string(&new_chart_data).unwrap();
    let data_key = format!("{}::{}::{}", process_id, node_id, "chart_data");
    set_store_value(data_key, data_str, store).await;

    Ok("success".into())
}