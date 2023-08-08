use std::sync::Arc;

use tokio::sync::Mutex;

use crate::{
    data_store::QuantaDataStore, 
    handler::{
        QuantaResult, 
        functions::{load::{load_process_id, unload_process_id}, 
        quanta_loop::{load_loop, unload_loop, get_loop_index}, 
        indicator::{string_to_date, build_fields, add_indicator, update_indicator}, 
        quanta_data::apply_data_rule, 
        compilation::init_compilation, upload::upload_data
    }
}};
use crate::handler::functions::analysis::{analyze_fields, load_indicators_analysis};
use crate::handler::functions::callstack::execute_stack_wrapper;
use crate::handler::functions::compilation::compile_project;
use crate::handler::functions::sdmx::{get_sdmx_field_key, get_sdmx_field_value};
use crate::handler::functions::sdmx::mapper::sdmx_data_mapper;
use crate::handler::functions::sdmx::parser::sdmx_parser;

use super::messages::ExecuteFunctionBody;

pub async fn parse_socket_function(
    process_id: String,
    socket_data: String,
    store: &Arc<Mutex<QuantaDataStore>>
) -> QuantaResult {
    let body: ExecuteFunctionBody = serde_json::from_str(&socket_data).expect("bad_body");

    let function_id = match body.function_id {
        Some(v) => v,
        None => return Err("no_function_id".into())
    };

    let function_data = match body.function_data {
        Some(v) => v,
        None => return Err("no_function_data".into())
    };

    let node_id = match body.node_id {
        Some(v) => v,
        None => return Err("no_node_id".into())
    };

    let output_ids = match body.output_ids {
        Some(v) => v,
        None => return Err("no_output_ids".into())
    };

    let function_data = function_data.to_string();
    let function_id = function_id.as_str();

    let output: QuantaResult = match function_id {
        "load_process_id" => load_process_id(process_id, node_id, function_data, store).await,
        "unload_process_id" => unload_process_id(process_id, node_id, function_data, store).await,
        "load_loop" => load_loop(process_id, node_id, function_data, store).await,
        "unload_loop" => unload_loop(process_id, node_id, function_data, store).await,
        "get_loop_index" => get_loop_index(process_id, node_id, function_data, store).await,
        "string_to_date" => string_to_date(process_id, node_id, function_data, store).await,
        "build_fields" => build_fields(process_id, node_id, function_data, store).await,
        "add_indicator" => add_indicator(process_id, node_id, function_data, store).await,
        "update_indicator" => update_indicator(process_id, node_id, function_data, store).await,
        "apply_data_rule" => apply_data_rule(process_id, node_id, function_data, store).await,
        "init_compilation" => init_compilation(process_id, node_id, function_data, store).await,
        "compile_project" => compile_project(process_id, node_id, function_data, store).await,
        "load_indicators_analysis" => load_indicators_analysis(process_id, node_id, function_data, store).await,
        "analyze_fields" => analyze_fields(process_id, node_id, function_data, store).await,
        "sdmx_data_parser" => sdmx_parser(process_id, node_id, function_data, store, output_ids).await,
        "sdmx_data_mapper" => sdmx_data_mapper(process_id, node_id, function_data, store).await,
        "get_sdmx_field_key" => get_sdmx_field_key(process_id, node_id, function_data, store).await,
        "get_sdmx_field_val" => get_sdmx_field_value(process_id, node_id, function_data, store).await,
        "execute_stack" => execute_stack_wrapper(process_id, node_id, function_data, store).await,
        "upload-data" => upload_data(process_id, node_id, function_data, store).await,
        _ => Ok("no_func".into())
    };

    return output
}