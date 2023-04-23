use actix_web::web::Data;
use basteh::Basteh;
use uuid::Uuid;

use crate::handler::functions::{
    callstack::types::{StackFunction, QuantaEdge, QuantaSchema}, 
    types::{QuantaFieldParam, InternalStore}, 
    build_fields::{BuildFieldsBody, build_fields}
};

use super::{types::QuantaSocket, utils::{get_input_edge, is_failed_node}};

pub async fn build_fields_wrapper(
    process_id: String,
    stack: StackFunction, 
    edges: &Vec<QuantaEdge>,
    executed_nodes: &mut Vec<String>,
    failed_nodes: &mut Vec<String>,
    data_store: &Data<Basteh>,
    schema: QuantaSchema
) {
    let node_id = stack.node_id.unwrap();
    let schema_nodes = schema.children;
    if schema_nodes.is_none() {
        failed_nodes.push(node_id);
        return;
    }

    let schema_nodes = schema_nodes.unwrap();
    let mut dynamic_sockets: Vec<QuantaSocket> = Vec::new();

    for schema_node in schema_nodes.iter() {
        let schema_type = schema_node.quanta_type.as_ref().unwrap();
        let schema_type = schema_type.clone();

        let schema_name = schema_node.name.as_ref().unwrap();
        let schema_name = schema_name.clone();

        let schema_id = schema_node.node_id.as_ref().unwrap();
        let schema_id = schema_id.clone();

        dynamic_sockets.push(QuantaSocket {
            type_ref: Some(schema_type),
            socket_name: Some(schema_name),
            socket_id: Some(schema_id)
        });
    }

    let mut field_params: Vec<QuantaFieldParam> = Vec::new();
    for socket in dynamic_sockets.iter() {
        let node_id = node_id.clone();
        let socket_id = socket.socket_id.as_ref().unwrap();
        let socket_id = socket_id.clone();

        let edge = get_input_edge(node_id, socket_id, edges);
        if edge.is_none() || edge.as_ref().unwrap().validate() == false {
            continue;
        }

        let edge = edge.unwrap();
        let internal_socket = InternalStore {
            node_id: edge.source,
            socket_id: edge.source_handle
        };

        let field_name = &socket.socket_name;
        let field_name = field_name.clone();

        let field_type = &socket.type_ref;
        let field_type = field_type.clone();

        let field_param = QuantaFieldParam {
            field_name: field_name,
            field_type: field_type,
            socket: Some(internal_socket)
        };

        field_params.push(field_param);
    }

    //error check the field params
    for field_param in field_params.iter() {
        let field_node_id = field_param.socket.as_ref().unwrap();
        let field_node = field_node_id.clone();
        let phantom_edge = QuantaEdge {
            id: None,
            source: field_node.node_id,
            source_handle: field_node.socket_id,
            target: None,
            target_handle: None
        };

        if is_failed_node(&phantom_edge, failed_nodes) {
            failed_nodes.push(node_id);
            return;
        }
    }

    let body = BuildFieldsBody { fields: Some(field_params) };
    let body_string = serde_json::to_string(&body).unwrap();
    let request_id = Uuid::new_v4().to_string();
    let res = build_fields(
        request_id, 
        node_id.clone(), 
        process_id, 
        body_string, 
        data_store
    ).await;

    if res.is_err() {
        failed_nodes.push(node_id);
        return;
    }

    executed_nodes.push(node_id);
}