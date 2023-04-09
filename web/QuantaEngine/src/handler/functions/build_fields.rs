use actix_web::web;
use basteh::Basteh;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use super::types::{QuantaFieldParam, QuantaDate, QuantaString};
use crate::{handler::{messages, socket_response, Result, socket_store::{set_store_value, get_store_value}}, quanta_dataset::{DatasetField, DatasetFieldItem}};

#[derive(Debug, Deserialize, Serialize)]
pub struct BuildFieldsBody {
    #[serde(rename="fields")]
    fields: Option<Vec<QuantaFieldParam>>
}

pub async fn build_fields(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: BuildFieldsBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.fields.is_none() {
        return Err("requires input fields".into())
    }

    //validate the fields
    let fields = body.fields.unwrap();
    for field in fields.iter() {
        let field = field.clone();
        if field.field_name.is_none() {
            return Err("requires field_name in field".into())
        } 

        let field_type = &field.field_type.unwrap();
        if field_type.validate() == false {
            return Err("requires a valid field_type".into())
        }

        let socket = &field.socket.unwrap();
        if socket.validate() == false {
            return Err("requires a valid socket".into())
        }
    }

    //create the field object
    let mut field_object = DatasetField::new();
    for field in fields.iter() {
        let field = field.clone();
        if field.validate() == false {
            return Err("submit valid fields".into())
        }

        let field_type = field.field_type.unwrap();
        let field_name = field.field_name.unwrap();
        let type_id = field_type.type_id.unwrap();
        
        let mut field_type = String::from("string");
        if type_id == "date" {
            field_type = String::from("date");
        }
 
        let field_socket = field.socket.unwrap();
        let field_socket_node_id = field_socket.node_id.clone().unwrap();
        let field_socket_socket_id = field_socket.socket_id.clone().unwrap();
        let field_value = get_store_value(&process_id, &field_socket_node_id, &field_socket_socket_id, data_store).await?;

        let mut string_value: Option<String> = None;
        let mut date_value: Option<DateTime<Utc>> = None;
        if field_type == "string" {
            let field_value = serde_json::from_value::<QuantaString>(field_value.clone())?;
            string_value = Some(field_value.value);
        } if field_type == "date" {
            let quanta_date: QuantaDate = serde_json::from_value(field_value)?;
            date_value = Some(quanta_date.internal_date);
        }

        let field_item = DatasetFieldItem::new(field_name, field_type, string_value, date_value)?;
        field_object.dataset_fields.push(field_item);
    }

    let field_object_string = serde_json::to_string(&field_object)?;
    set_store_value(&process_id, &node_id, &String::from("field"), &field_object_string, data_store).await;
    Ok(socket_response(String::from("success"), false, request_id))
}