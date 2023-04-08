use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use crate::{handler::{messages, socket_response, Result, socket_store::{get_store_value, set_store_value}}, quanta_dataset::ChartData};

use super::types::{InternalStore, QuantaDate};

#[derive(Debug, Deserialize, Serialize)]
struct ApplyDataRuleBody {
    #[serde(rename="dataRule")]
    data_rule: Option<String>,

    #[serde(rename="dateSocket")]
    date_socket: Option<InternalStore>,

    #[serde(rename="chartSocket")]
    chart_socket: Option<InternalStore>
}

pub async fn apply_data_rule(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: ApplyDataRuleBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    let data_rule = body.data_rule.expect("requires a selected rule");
    let mut filled = false;

    //retreive the chart data
    let chart_socket = body.chart_socket.expect("requires chart data");
    if chart_socket.validate() == false {
        return Err("malformed data".into())
    }

    let chart_socket_id = chart_socket.node_id.unwrap();
    let chart_socket_socket = chart_socket.socket_id.unwrap();

    let chart_socket_data = get_store_value(&process_id, &chart_socket_id, &chart_socket_socket, data_store).await?;
    let chart_data: Vec<ChartData> = serde_json::from_value(chart_socket_data)?;
    let mut new_chart_data: Vec<ChartData> = Vec::new();

    if data_rule == "is_projection" {
        let date_socket = body.date_socket.expect("rule requires date");
        if date_socket.validate() == false {
            return Err("malformed data".into())
        }

        let date_socket_id = date_socket.node_id.unwrap();
        let date_socket_socket = date_socket.socket_id.unwrap();

        let date_value = get_store_value(&process_id, &date_socket_id, &date_socket_socket, data_store).await?;
        let date_value: QuantaDate = serde_json::from_value(date_value)?;
        let date = date_value.internal_date;

        for data_point in chart_data.iter() {
            let mut data_point = data_point.clone();
            let data_point_date = data_point.x_val;

            if data_point_date > date {
                data_point.is_projection = true;
            }

            new_chart_data.push(data_point);
        }

        filled = true;
    }

    if filled == false {
        return Err("No rule selected".into())
    }

    let chart_data_str = serde_json::to_string(&new_chart_data)?;
    set_store_value(&process_id, &node_id, &String::from("chart_data"), &chart_data_str, data_store).await;
    Ok(socket_response(String::from("success"), false, request_id))
}