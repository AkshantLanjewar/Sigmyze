use actix_web::web;
use basteh::Basteh;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::{handler::{ messages, Result, socket_response, functions::types::QuantaIndicator }, quanta_dataset::{DatasetFieldItem}};

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
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: AnalyzeFieldsBody = serde_json::from_str(socket_data.as_str()).expect("json_error");
    let field_names = body.field_names.expect("bad_field_names");

    let storage_loc = format!("{}::indicators", &process_id);
    let storage_res = data_store.remove::<String>(storage_loc).await?.expect("storage_error");
    let indicators: Vec<QuantaIndicator> = serde_json::from_str(storage_res.as_str()).expect("storage_json_error");
    let mut analyzed_fields: Vec<AnalyzeFieldResult> = Vec::new();
    
    for field in field_names.iter() {
        let field = field.as_str();
        let mut is_array = false;
        let mut field_type_glob: Option<String> = None;

        let mut string_value: Option<String> = None;
        let mut string_arr: Option<Vec<String>> = None;

        let mut date_val: Option<DateTime<Utc>> = None;
        let mut date_arr: Option<Vec<DateTime<Utc>>> = None;

        for indicator in indicators.iter() {
            let indicator_fields = &indicator.field.dataset_fields;
            let mut indicator_field: Option<DatasetFieldItem> = None;

            for indicator_field_p in indicator_fields.iter() {
                let field_key = &indicator_field_p.field_key;
                let field_key = field_key.as_str();

                if field_key == field {
                    indicator_field = Some(indicator_field_p.clone());
                }
            }

            if indicator_field.is_none() {
                continue;
            }

            let indicator_field = indicator_field.unwrap();
            let field_type = indicator_field.field_type;
            field_type_glob = Some(field_type.clone());

            match field_type.as_str() {
                "string" => {
                    let string_val = indicator_field.string_field;
                    if string_val.is_none() {
                        continue;
                    }

                    let string_val = string_val.unwrap();
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
                                let new_arr = vec![String::from(old_string_val), String::from(string_val_str)];
                                is_array = true;
                                string_arr = Some(new_arr);
                            }
                        }
                    } else {
                        if string_arr.is_none() {
                            string_arr = Some(Vec::new());
                        }

                        let mut tmp_string_arr = string_arr.unwrap();
                        if tmp_string_arr.contains(&string_val) == true {
                            string_arr = Some(tmp_string_arr);
                            continue;
                        }

                        tmp_string_arr.push(string_val);
                        string_arr = Some(tmp_string_arr);
                    }
                },

                "date" => {
                    let date_value = indicator_field.date_field;
                    if date_value.is_none() {
                        continue;
                    }

                    let date_value = date_value.unwrap();
                    if is_array == false {
                        if date_val.is_none() {
                            date_val = Some(date_value);
                        } else {
                            let old_date_val = date_val.as_ref().unwrap();
                            let old_date_val = old_date_val.clone();
                            
                            if old_date_val == date_value {
                                continue;
                            } else {
                                let tmp_date_arr = vec![old_date_val.clone(), date_value.clone()];
                                is_array = true;
                                date_arr = Some(tmp_date_arr);
                            }
                        }
                    } else {
                        if date_arr.is_none() {
                            date_arr = Some(Vec::new());
                        }

                        let mut tmp_date_arr = date_arr.unwrap();
                        if tmp_date_arr.contains(&date_value) == true {
                            date_arr = Some(tmp_date_arr);
                            continue;
                        }

                        tmp_date_arr.push(date_value);
                        date_arr = Some(tmp_date_arr);
                    }
                },

                _ => {}
            }
        }

        if field_type_glob.is_none() {
            continue;
        }

        let field_type_glob = field_type_glob.unwrap();
        let field_result = AnalyzeFieldResult {
            object_id: String::from(field),
            object_type: field_type_glob,
            is_array: is_array,
            string_value,
            string_array: string_arr,
            date_value: date_val,
            date_array: date_arr
        };

        analyzed_fields.push(field_result);
    }

    let resp = AnalyzeFieldResults { analysis_results: analyzed_fields };
    let resp_str = serde_json::to_string(&resp).unwrap();
    Ok(socket_response(resp_str, false, request_id))
}