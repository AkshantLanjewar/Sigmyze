use std::{sync::Arc};

use chrono::{Utc, TimeZone, DateTime};
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{handler::QuantaResult, data_store::{QuantaDataStore, set_store_value, get_store_value, append_cache}};

use super::{QuantaDate, QuantaFieldParam, quanta_data::{DatasetField, DatasetFieldItem, ChartData}, QuantaString, InternalStore, QuantaIndicator};

#[derive(Debug, Deserialize, Serialize)]
pub struct StringToDateBody {
    pub timestamp: Option<i64>
}

pub async fn string_to_date(
    process_id: String,
    node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: StringToDateBody = serde_json::from_str(&function_data).unwrap();
    let timestamp = match body.timestamp {
        Some(v) => v,
        None => return Err("no_timestamp".into())
    };

    let datetime = Utc.timestamp_millis_opt(timestamp).unwrap();
    let datetime_object = QuantaDate::new(datetime);
    let datetime_object_str = serde_json::to_string(&datetime_object).unwrap();

    let store_key = format!("{}::{}::{}", process_id, node_id, "out_date");
    set_store_value(store_key, datetime_object_str, store).await;
    Ok("converted".into())
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BuildFieldsBody {
    #[serde(rename="fields")]
    pub fields: Option<Vec<QuantaFieldParam>>
}

pub async fn build_fields(
    process_id: String,
    node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: BuildFieldsBody = serde_json::from_str(&function_data).expect("bad_body");
    let fields = match body.fields {
        Some(v) => v,
        None => return Err("no_fields".into())
    };

    let mut collected_fields: Vec<QuantaFieldParam> = Vec::new();
    for field in fields.iter() {
        if field.field_name.is_none() {
            continue;
        }

        let field_type = match field.field_type.as_ref() {
            Some(v) => v,
            None => continue
        }; if field_type.validate() == false {
            continue;
        }

        let socket = match field.socket.as_ref() {
            Some(v) => v,
            None => continue
        }; if socket.validate() == false {
            continue;
        }

        collected_fields.push(field.clone());
    }

    //build the field object
    let mut field_object = DatasetField::new();
    for field in collected_fields.iter() {
        if field.validate() == false {
            return Err("invalid_field".into())
        }

        let field_type = field.field_type.clone().unwrap();
        let field_name = field.field_name.clone().unwrap();
        let type_id = field_type.type_id.unwrap();

        let field_socket = field.socket.clone().unwrap();
        let field_socket_node_id = field_socket.node_id.unwrap();
        let field_socket_socket_id = field_socket.socket_id.unwrap();

        let field_key = format!("{}::{}::{}", process_id, field_socket_node_id, field_socket_socket_id);
        let field_val = get_store_value(field_key, store).await;
        if field_val.is_none() {
            return Err("no_input_value".into())
        }

        let mut string_value: Option<String> = None;
        let mut date_value: Option<DateTime<Utc>> = None;
        let field_val = field_val.unwrap();

        if type_id.as_str() == "string" {
            let parsed_val = serde_json::from_str::<QuantaString>(&field_val).unwrap();
            string_value = Some(parsed_val.value);
        } if type_id.as_str() == "date" {
            let quanta_date: QuantaDate = serde_json::from_str(&field_val).unwrap();
            date_value = Some(quanta_date.internal_date);
        }

        let field_item = DatasetFieldItem::new(
            field_name, 
            type_id, 
            string_value, 
            date_value
        ).unwrap();

        field_object.dataset_fields.push(field_item);
    }

    let field_object_str = serde_json::to_string(&field_object).unwrap();
    let field_object_key = format!("{}::{}::{}", process_id, node_id, "field");
    set_store_value(field_object_key, field_object_str, store).await;
    Ok("success".into())
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AddIndicatorBody {
    #[serde(rename="fieldInput")]
    pub field_input: Option<InternalStore>,

    #[serde(rename="chartInput")]
    pub chart_input: Option<InternalStore>
}

pub async fn add_indicator(
    process_id: String,
    _node_id: String,
    function_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: AddIndicatorBody = serde_json::from_str(&function_data).expect("bad_body");

    let field_input = match body.field_input {
        Some(v) => v,
        None => return Err("no_field_input".into())
    };

    let chart_input = match body.chart_input {
        Some(v) => v,
        None => return Err("no_chart_input".into())
    };

    if field_input.validate() == false || chart_input.validate() == false {
        return Err("invalid_sockets".into())
    }

    let field_node_id = field_input.node_id.unwrap();
    let field_socket_id = field_input.socket_id.unwrap();
    let field_key = format!("{}::{}::{}", process_id, field_node_id, field_socket_id);

    let field_value = match get_store_value(field_key, store).await {
        Some(v) => v,
        None => return Err("no_field_value".into())
    };

    let field: DatasetField = match serde_json::from_str(&field_value) {
        Ok(v) => v,
        Err(_) => return Err("invalid_field".into())
    };

    let chart_node_id = chart_input.node_id.unwrap();
    let chart_socket_id = chart_input.socket_id.unwrap();
    let chart_key = format!("{}::{}::{}", process_id, chart_node_id, chart_socket_id);

    let chart_value = match get_store_value(chart_key, store).await {
        Some(v) => v,
        None => return Err("no_chart_value".into())
    };

    let chart: Vec<ChartData> = match serde_json::from_str(&chart_value) {
        Ok(v) => v,
        Err(_) => return Err("invalid_chart".into())
    };

    let indicator = QuantaIndicator::new(field, chart);
    let indicator_str = serde_json::to_string(&indicator).unwrap();
    let cache_key = format!("{}::cache", process_id);
    append_cache(cache_key, indicator_str, store).await;

    Ok("success".into())
}