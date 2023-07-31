use std::sync::Arc;
use chrono::{DateTime, Utc};
use tokio::sync::Mutex;
use crate::data_store::{get_store_value, QuantaDataStore, set_store_value};
use crate::handler::{QuantaResult, SERVER_URL};
use serde::{Deserialize, Serialize};
use crate::handler::functions::{GetIndicatorLengthResp, GetIndicatorsResp, QuantaIndicator};
use crate::handler::functions::quanta_data::DatasetFieldItem;

#[derive(Debug, Deserialize, Serialize)]
struct LoadIndicatorsAnalysisBody {
	#[serde(rename="organizationId")]
	pub organization_id: Option<String>,

	#[serde(rename="quantaId")]
	pub quanta_id: Option<String>
}

const PAGE_LENGTH: i32 = 1000;

pub async fn load_indicators_analysis(
	process_id: String,
	_node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: LoadIndicatorsAnalysisBody = serde_json::from_str(&function_data)
		.expect("bad_body");

	let organization_id = match body.organization_id {
		Some(v) => v,
		None => return Err("no_organization_id".into())
	};

	let quanta_id = match body.quanta_id {
		Some(v) => v,
		None => return Err("no_quanta_id".into())
	};

	let length_url = format!(
		"{}/api/v2/quanta/public/indicators_length/{}/{}/{}",
		SERVER_URL,
		organization_id,
		quanta_id,
		process_id
	);

	let client = reqwest::Client::new();
	let length_res = client.get(length_url)
		.send()
		.await.unwrap()
		.text()
		.await.unwrap();

	let length_resp: GetIndicatorLengthResp = serde_json::from_str(&length_res)
		.expect("bad_length_resp");
	let indicators_length = match length_resp.length {
		Some(v) => v,
		None => return Err("no_indicators_length".into())
	};

	let mut collected_indicators: Vec<QuantaIndicator> = Vec::new();
	let mut curr_page = 0;

	while (curr_page) * PAGE_LENGTH < indicators_length {
		let indicator_url = format!(
			"{}/api/v2/quanta/public/indicators_paged/{}/{}/{}/{}/{}",
			SERVER_URL,
			PAGE_LENGTH,
			curr_page,
			organization_id,
			quanta_id,
			process_id
		);

		let indicator_res = client.get(indicator_url)
			.send()
			.await.expect("bad_req")
			.text()
			.await.expect("bad_res");

		let indicator_resp: GetIndicatorsResp = serde_json::from_str(&indicator_res)
			.expect("indicator_parse_error");
		let mut indicators = match indicator_resp.indicators {
			Some(v) => v,
			None => return Err("no_resp_indicators".into())
		};

		collected_indicators.append(&mut indicators);
		curr_page += 1;
	}

	let indicator_str = serde_json::to_string(&collected_indicators).unwrap();
	let storage_loc = format!("{}::indicators", &process_id);
	set_store_value(storage_loc, indicator_str, store).await;

	Ok("success".into())
}

#[derive(Debug, Deserialize, Serialize)]
struct AnalyzeFieldsBody {
	#[serde(rename="fieldNames")]
	field_names: Option<Vec<String>>
}

#[derive(Debug, Deserialize, Serialize)]
struct AnalyzeFieldResult {
	#[serde(rename="objectId")]
	object_id: String,

	#[serde(rename="objectType")]
	object_type: String,

	#[serde(rename="isArray")]
	is_array: bool,

	#[serde(rename="stringValue")]
	string_value: Option<String>,

	#[serde(rename="stringArray")]
	string_array: Option<Vec<String>>,

	#[serde(rename="dateValue")]
	date_value: Option<DateTime<Utc>>,

	#[serde(rename="dateArray")]
	date_array: Option<Vec<DateTime<Utc>>>
}

#[derive(Debug, Deserialize, Serialize)]
struct AnalyzeFieldResults {
	#[serde(rename="analysisResults")]
	analysis_results: Vec<AnalyzeFieldResult>
}

pub async fn analyze_fields(
	process_id: String,
	_node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
	let body: AnalyzeFieldsBody = serde_json::from_str(&function_data).expect("bad_body");
	let field_names = match body.field_names {
		Some(v) => v,
		None => return Err("no_field_names".into())
	};

	let storage_loc = format!("{}::indicators", &process_id);
	let storage_val = match get_store_value(storage_loc, store).await {
		Some(v) => v,
		None => return Err("no_stored_indicators".into())
	};

	let indicators: Vec<QuantaIndicator> = serde_json::from_str(&storage_val)
		.expect("invalid_storage");
	let mut analyzed_fields: Vec<AnalyzeFieldResult> = Vec::new();

	//iterate through and analyze the individual fields
	for field in field_names.iter() {
		let field = field.as_str();
		let mut is_array = false;
		let mut field_type_glob: Option<String> = None;

		let mut string_value: Option<String> = None;
		let mut string_array: Option<Vec<String>> = None;

		let mut date_value: Option<DateTime<Utc>> = None;
		let mut date_array: Option<Vec<DateTime<Utc>>> = None;

		for indicator in indicators.iter() {
			let indicator_fields = &indicator.field.dataset_fields;
			let mut indicator_field: Option<DatasetFieldItem> = None;

			for child_field in indicator_fields.iter() {
				let field_key = &child_field.field_key;
				let field_key = field_key.as_str();

				if field_key == field {
					indicator_field = Some(child_field.clone());
				}
			}

			if indicator_field.is_none() {
				continue;
			}

			let indicator_field = indicator_field.unwrap();
			let field_type = indicator_field.field_type;
			field_type_glob = Some(field_type.clone());

			match field_type.as_str() {
				"date" => {
					let date_val = match indicator_field.date_field {
						Some(v) => v,
						None => continue
					};

					if is_array == false {
						if date_value.is_none() {
							date_value = Some(date_val);
						} else {
							let old_date_val = date_value.as_ref().unwrap();
							let old_date_val = old_date_val.clone();

							if old_date_val == date_val {
								continue;
							} else {
								let tmp_date_array = vec![
									old_date_val.clone(),
									date_val.clone()
								];

								is_array = true;
								date_array = Some(tmp_date_array);
							}
						}
					} else {
						let mut tmp_date_array = match &date_array {
							Some(v) => v.clone(),
							None => Vec::new()
						};

						if tmp_date_array.contains(&date_val) == true {
							date_array = Some(tmp_date_array);
							continue;
						}

						tmp_date_array.push(date_val);
						date_array = Some(tmp_date_array);
					}
				}

				"string" => {
					let string_val = match indicator_field.string_field {
						Some(v) => v,
						None => continue
					};

					if is_array == false {
						if string_value.is_none() {
							string_value = Some(string_val);
						} else {
							let old_string_val = string_value.as_ref().unwrap();
							let old_string_val = old_string_val.as_str();
							let string_val_str = string_val.as_str();

							if old_string_val == string_val_str {
								continue;
							} else {
								let new_arr = vec![
									String::from(old_string_val),
									String::from(string_val_str)
								];

								is_array = true;
								string_array = Some(new_arr);
							}
						}
					} else {
						let mut tmp_string_array = match string_array.clone() {
							Some(v) => v,
							None => Vec::new()
						};

						if tmp_string_array.contains(&string_val) == true {
							string_array = Some(tmp_string_array);
							continue;
						}

						tmp_string_array.push(string_val);
						string_array = Some(tmp_string_array);
					}
				}

				_ => continue
			}
		}

		if field_type_glob.is_none() {
			continue;
		}

		let field_type_glob = field_type_glob.unwrap();
		let field_result = AnalyzeFieldResult {
			object_id: field.into(),
			object_type: field_type_glob,
			is_array: is_array,
			string_value: string_value,
			string_array: string_array,
			date_value,
			date_array
		};

		analyzed_fields.push(field_result);
	}

	let resp = AnalyzeFieldResults { analysis_results: analyzed_fields };
	let resp_str = serde_json::to_string(&resp).unwrap();
	Ok(resp_str)
}