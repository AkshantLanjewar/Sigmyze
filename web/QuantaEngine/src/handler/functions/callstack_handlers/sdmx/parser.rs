use crate::handler::functions::callstack::types::{QuantaEdge, StackFunction, StackParam};
use crate::handler::functions::callstack_handlers::{get_input_edge, QuantaValueResult};
use crate::handler::functions::InternalStore;
use crate::handler::functions::sdmx::parser::SDMXFunctionBody;

pub async fn sdmx_data_parser_wrapper(
	stack: &StackFunction,
	edges: &Vec<QuantaEdge>,
	failed_nodes: &Vec<String>,
	output_ids: &mut Vec<String>
) -> QuantaValueResult {
	let inputs = match stack.inputs.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_inputs".into())
	};

	let node_id = match stack.node_id.as_ref() {
		Some(v) => v.clone(),
		None => return Err("no_node_id".into())
	};

	let mut search_inputs: Vec<String> = Vec::new();
	let mut sdmx_file_type = "xml";
	let mut dynamic_inputs: Vec<StackParam> = Vec::new();

	for input in inputs.iter() {
		let input_id = match input.id.as_ref() {
			Some(v) => v,
			None => continue
		};

		if input_id == "format" {
			let input_type = match input.type_ref.as_ref() {
				Some(v) => v,
				None => continue
			};

			if input_type.validate() == false {
				continue;
			}

			let input_id = match input_type.type_id.as_ref() {
				Some(v) => v,
				None => continue
			};

			if input_id == "sdmx_xml" {
				sdmx_file_type = "xml";
				search_inputs = vec!["data_file".into(), "schema_file".into()];
			}
		}

		if search_inputs.contains(input_id) {
			dynamic_inputs.push(input.clone());
		}
	}

	return match sdmx_file_type {
		"xml" => {
			let mut data_file_id: Option<String> = None;
			let mut schema_file_id: Option<String> = None;

			for input in dynamic_inputs.iter() {
				let dynamic_input_id = match input.id.as_ref() {
					Some(v) => v,
					None => continue
				};

				if dynamic_input_id == "data_file" {
					data_file_id = Some(dynamic_input_id.clone());
				} else if dynamic_input_id == "schema_file" {
					schema_file_id = Some(dynamic_input_id.clone());
				}
			}

			let data_file_id = match data_file_id {
				Some(v) => v,
				None => return Err("no_data_file".into())
			};

			let schema_file_id = match schema_file_id {
				Some(v) => v,
				None => return Err("no_schema_file".into())
			};

			let schema_edge = match get_input_edge(&node_id, &schema_file_id, edges) {
				Some(v) => v,
				None => return Err("no_schema_edge".into())
			};

			let data_edge = match get_input_edge(&node_id, &data_file_id, edges) {
				Some(v) => v,
				None => return Err("no_data_edge".into())
			};

			let data_edge_id = data_edge.source.as_ref().unwrap();
			let schema_edge_id = schema_edge.source.as_ref().unwrap();

			if failed_nodes.contains(data_edge_id) || failed_nodes.contains(schema_edge_id) {
				return Err("failed_inputs".into())
			}

			let xml_store = InternalStore {
				node_id: data_edge.source,
				socket_id: data_edge.source_handle
			};

			let xsd_store = InternalStore {
				node_id: schema_edge.source,
				socket_id: schema_edge.source_handle
			};

			let sdmx_data = SDMXFunctionBody {
				xml_data: Some(xml_store),
				xsd_data: Some(xsd_store)
			};

			output_ids.clear();
			output_ids.push("sdmx_indicators".into());

			let value = serde_json::to_value(&sdmx_data).unwrap();
			Ok(value)
		}

		_ => Err("no_selected".into())
	}
}