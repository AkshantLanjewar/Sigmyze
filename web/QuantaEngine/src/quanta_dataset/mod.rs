use std::{fmt::Debug, error};

use chrono::{DateTime, Utc, serde::ts_seconds};
use serde::{Deserialize, Serialize};

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

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
    
    pub fn new(field_key: String, field_type: String, string_field: Option<String>, date_field: Option<DateTime<Utc>>) -> Result<Self> {
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
    pub dataset_fields: Vec<DatasetFieldItem>
}

impl DatasetField {
    pub fn new() -> Self {
        Self {
            dataset_fields: Vec::new()
        }
    }
}