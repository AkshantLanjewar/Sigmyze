use crate::handler::functions::callstack::types::QuantaEdge;

pub fn get_input_edge(node_id: String, socket_id: String, edges: &Vec<QuantaEdge>) -> Option<QuantaEdge> {
    let mut input_edge: Option<QuantaEdge> = None;

    for edge in edges.iter() {
        if edge.validate() == false {
            continue;
        } 

        let edge_target = edge.target.as_ref().unwrap();
        let edge_socket = edge.target_handle.as_ref().unwrap();
        if edge_target.as_str() == node_id.as_str() && edge_socket.as_str() == socket_id.as_str() {
            input_edge = Some(edge.clone());
        }
    }

    input_edge
}

pub fn is_failed_node(source_edge: &QuantaEdge, failed_nodes: &Vec<String>) -> bool {
    let source_node = source_edge.source.as_ref().unwrap();
    if failed_nodes.contains(source_node) {
        return true;
    }

    false
}