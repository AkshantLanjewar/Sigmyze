use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use crate::{handler::{messages, socket_store::{get_store_value, set_store_value}}, sdmx_parser::sdmx_series::SDMXSeries};
use crate::handler::{Result, socket_response, functions::types};

#[derive(Debug, Deserialize, Serialize)]
pub struct SDMXDataMapperData {
    pub input: Option<types::InternalStore>
}

pub async fn sdmx_data_mapper(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: SDMXDataMapperData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.input.is_none() {
        return Err("requires input connection".into())
    }

    let input_socket = body.input.unwrap();
    let input_node_id = input_socket.node_id.unwrap();
    let input_socket_id = input_socket.socket_id.unwrap();

    let input_value = get_store_value(&process_id, &input_node_id, &input_socket_id, data_store).await?;
    let input_value: SDMXSeries = serde_json::from_value(input_value)?;

    let chart_data = input_value.chart_data;
    let chart_data = serde_json::to_string(&chart_data)?;
    set_store_value(&process_id, &node_id, &String::from("chart_data"), &chart_data, data_store).await;

    let series_fields = input_value.series_fields;
    let mut field_names: Vec<String> = Vec::new();
    for series_field in series_fields.iter() {
        let series_str = serde_json::to_string(series_field)?;
        let field_name = &series_field.field_key;
        let field_name = field_name.to_lowercase();

        set_store_value(&process_id, &node_id, &field_name, &series_str, data_store).await;
        field_names.push(field_name);
    }

    let field_names_string = serde_json::to_string(&field_names)?;
    Ok(socket_response(field_names_string, false, request_id))
}