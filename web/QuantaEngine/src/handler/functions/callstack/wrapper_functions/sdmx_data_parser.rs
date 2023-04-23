use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{
    callstack::types::{StackFunction, QuantaEdge, StackParam}, 
    types::InternalStore, 
    sdmx::sdmx_data_parser::{SDMXFunctionData, socket_sdmx_parser}
};

use super::utils::{get_input_edge, is_failed_node};

pub async fn sdmx_data_parser_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>
) {
    let inputs = stack.inputs.expect("requires_inputs");
    let node_id = stack.node_id.unwrap();

    let mut search_inputs: Vec<String> = Vec::new();
    let mut sdmx_file_type = "xml";
    let mut dynamic_inputs: Vec<StackParam> = Vec::new();

    for input in inputs.iter() {
        let input_id = input.id.as_ref().unwrap();
        if input_id == "format" {
            let input_type = input.type_ref.as_ref().unwrap();
            if input_type.validate() == false {
                continue;
            }

            let input_id = input_type.type_id.as_ref().unwrap();
            if input_id == "sdmx_xml" {
                sdmx_file_type = "xml";
                search_inputs = vec!["data_file".into(), "schema_file".into()];
            }
        }

        if search_inputs.contains(input_id) {
            dynamic_inputs.push(input.clone());
        }
    }

    match sdmx_file_type {
        "xml" => {
            let mut data_file_id: Option<String> = None;
            let mut schema_file_id: Option<String> = None;

            for input in dynamic_inputs.iter() {
                let dynamic_input_id = input.id.as_ref().unwrap();

                if dynamic_input_id == "data_file" {
                    data_file_id = Some(dynamic_input_id.clone());
                } if dynamic_input_id == "schema_file" {
                    schema_file_id = Some(dynamic_input_id.clone());
                }
            }

            if data_file_id.is_none() || schema_file_id.is_none() {
                failed_nodes.push(node_id);
                return;
            }

            let data_file_id = data_file_id.unwrap();
            let schema_file_id = schema_file_id.unwrap();

            let data_edge = get_input_edge(node_id.clone(), data_file_id, edges);
            let schema_edge = get_input_edge(node_id.clone(), schema_file_id, edges);

            if data_edge.is_none() || schema_edge.is_none() {
                failed_nodes.push(node_id);
                return;
            } 

            let data_edge = data_edge.unwrap();
            let schema_edge = schema_edge.unwrap();

            if is_failed_node(&data_edge, failed_nodes) || is_failed_node(&schema_edge, failed_nodes) {
                failed_nodes.push(node_id);
                return;
            }

            let xml_store = InternalStore {
                node_id: data_edge.source,
                socket_id: data_edge.source_handle
            };

            let xsd_store = InternalStore {
                node_id: schema_edge.source,
                socket_id: schema_edge.source_handle
            };

            let sdmx_function_data = SDMXFunctionData {
                xml_data: Some(xml_store),
                xsd_data: Some(xsd_store)
            };

            let body_string = serde_json::to_string(&sdmx_function_data).unwrap();
            let node_id_clone = node_id.clone();
            let output_ids: Vec<String> = vec!["sdmx_indicators".into()];
            let request_id = Uuid::new_v4().to_string();

            let resp = socket_sdmx_parser(
                request_id, 
                node_id_clone, 
                process_id, 
                body_string, 
                output_ids, 
                data_store
            ).await;

            if resp.is_err() {
                failed_nodes.push(node_id);
                return;
            }
        },
        
        _ => {}
    }

    executed_nodes.push(node_id);
}