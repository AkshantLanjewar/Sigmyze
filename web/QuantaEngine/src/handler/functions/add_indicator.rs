use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};

use crate::{handler::{messages, socket_response, Result, socket_store::{get_store_value}}, quanta_dataset::{DatasetField, ChartData}};

use super::types::{InternalStore, QuantaIndicator};

#[derive(Debug, Deserialize, Serialize)]
pub struct AddIndicatorBody {
    #[serde(rename="fieldInput")]
    pub field_input: Option<InternalStore>,

    #[serde(rename="chartInput")]
    pub chart_input: Option<InternalStore>
}

pub async fn add_indicator(
    request_id: String,
    _node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: AddIndicatorBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    let field_input = body.field_input.expect("function requires field input");
    if field_input.validate() == false {
        return Err("invalid field input".into())
    }

    let field_input_node = field_input.node_id.unwrap();
    let field_input_socket = field_input.socket_id.unwrap();
    let field_input_value = get_store_value(&process_id, &field_input_node, &field_input_socket, data_store).await?;
    let field: DatasetField = serde_json::from_value(field_input_value)?;

    let chart_input = body.chart_input.expect("requires chart data");
    if chart_input.validate() == false {
        return Err("invalid chart input".into())
    }

    let chart_input_node = chart_input.node_id.unwrap();
    let chart_input_socket = chart_input.socket_id.unwrap();
    let chart_input_value = get_store_value(&process_id, &chart_input_node, &chart_input_socket, data_store).await?;
    let chart: Vec<ChartData> = serde_json::from_value(chart_input_value)?;

    let indicator = QuantaIndicator::new(field, chart);
    let indicator_string = serde_json::to_string(&indicator)?;
    let process_fmt = format!("{}::cache", &process_id);

    data_store.push(process_fmt, indicator_string).await?;
    Ok(socket_response(String::from("success"), false, request_id))
}