use std::error;
use actix_web::web;
use basteh::Basteh;

use super::messages::{self};
use super::functions::{sdmx_data_parser, loop_functions};

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

pub async fn parse_function_request(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: messages::ExecuteFunctionData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.function_id.is_none() {
        return Err("requires function_id".into())
    } if body.function_data.is_none() {
        return Err("requires function_data".into())
    } if body.node_id.is_none() {
        return Err("requires node_id".into())
    } if body.output_ids.is_none() {
        return Err("requires output ids".into())
    }

    let function_id = &body.function_id.unwrap();
    let function_id = function_id.as_str();

    let function_data = &body.function_data.unwrap();
    let function_data = function_data.to_string();

    let output_ids = body.output_ids.unwrap();
    let node_id = body.node_id.unwrap();

    println!("{}", function_id);
    match function_id {
        "sdmx_data_parser" => return sdmx_data_parser::socket_sdmx_parser(
            request_id,
            node_id,
            process_id,
            function_data,
            output_ids,
            data_store
        ).await,

        "load_loop" => return loop_functions::loop_load::load_loop(
            request_id,
            process_id,
            function_data,
            data_store
        ).await,

        "unload_loop" => return loop_functions::loop_unload::unload_loop(
            request_id, 
            function_data, 
            data_store
        ).await,

        _ => {}
    }

    Err("couldnt find function".into())

}