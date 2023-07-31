use std::sync::Arc;
use tokio::sync::Mutex;
use crate::data_store::{get_store_value, QuantaDataStore, set_store_value};
use crate::handler::functions::InternalStore;
use crate::handler::QuantaResult;
use crate::sdmx_parser::types::SDMXSeries;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct SDMXDataMapperData {
	pub input: Option<InternalStore>
}

pub async fn sdmx_data_mapper(
	process_id: String,
	node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: SDMXDataMapperData = serde_json::from_str(&function_data).expect("bad_body");

	let input = match body.input {
		Some(v) => v,
		None => return Err("no_input".into())
	};

	if input.validate() == false {
		return Err("invalid_input".into())
	}

	let input_node_id = input.node_id.unwrap();
	let input_socket_id = input.socket_id.unwrap();
	let input_key = format!("{}::{}::{}", &process_id, &input_node_id, &input_socket_id);

	let input_value = match get_store_value(input_key, store).await {
		Some(v) => v,
		None => return Err("no_input_value".into())
	};

	let input_value: SDMXSeries = match serde_json::from_str(&input_value) {
		Ok(v) => v,
		Err(_) => return Err("invalid_input_value".into())
	};

	let chart_data = input_value.chart_data;
	let chart_data_str = serde_json::to_string(&chart_data).unwrap();
	let chart_data_key = format!("{}::{}::{}", &process_id, &node_id, "chart_data");
	set_store_value(chart_data_key, chart_data_str, store).await;

	let series_fields = input_value.series_fields;
	let mut field_names: Vec<String> = Vec::new();

	for series_field in series_fields.iter() {
		let series_str = serde_json::to_string(series_field).unwrap();
		let field_name = &series_field.field_key;
		let field_name = field_name.to_lowercase();

		let series_key = format!("{}::{}::{}", &process_id, &node_id, &field_name);
		set_store_value(series_key, series_str, store).await;
		field_names.push(field_name);
	}

	let field_names_string = serde_json::to_string(&field_names).unwrap();
	Ok(field_names_string)
}