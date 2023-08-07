use std::sync::Arc;
use base64::Engine;
use base64::engine::general_purpose;
use crate::handler::functions::InternalStore;
use serde::{Deserialize, Serialize};
use tokio::fs::{File, remove_file};
use tokio::io::{AsyncWriteExt, BufWriter};
use tokio::sync::Mutex;
use uuid::Uuid;
use crate::data_store::{get_store_value, QuantaDataStore, set_store_value};
use crate::handler::QuantaResult;
use crate::sdmx_parser::sdmx_data_parser;

#[derive(Debug, Deserialize, Serialize)]
pub struct SDMXFunctionBody {
	pub xml_data: Option<InternalStore>,
	pub xsd_data: Option<InternalStore>
}

pub async fn sdmx_parser(
	process_id: String,
	node_id: String,
	function_data: String,
	store: &Arc<Mutex<QuantaDataStore>>,
	output_ids: Vec<String>,
) -> QuantaResult {
	let body: SDMXFunctionBody = serde_json::from_str(&function_data).expect("bad_body");

	let xml_data = match body.xml_data {
		Some(v) => v,
		None => return Err("no_xml_data".into())
	};

	let xsd_data = match body.xsd_data {
		Some(v) => v,
		None => return Err("no_xsd_data".into())
	};

	println!("[SDMX Parser]: validating sdmx socket data");
	if xml_data.validate() == false || xsd_data.validate() == false {
		return Err("invalid_socket".into())
	}

	let xml_node_id = xml_data.node_id.unwrap();
	let xml_socket_id = xml_data.socket_id.unwrap();
	let xml_key = format!("{}::{}::{}", &process_id, &xml_node_id, &xml_socket_id);

	println!("[SDMX Parser]: fetching XML data");
	let xml_data = match get_store_value(xml_key, store).await {
		Some(v) => v,
		None => return Err("no_xml_store".into())
	};

	let xml_data = xml_data.replace("\"","");
	let xml_data = general_purpose::STANDARD.decode(xml_data).unwrap();
	let xml_file_id = Uuid::new_v4().to_string();
	let xml_file_loc = format!("./data/{}.xml", xml_file_id);

	println!("[SDMX Parser]: creating xml file");
	let xml_file = File::create(&xml_file_loc)
		.await
		.expect("failed_create_xml_file");

	let mut xml_buffer = BufWriter::new(xml_file);
	xml_buffer.write_all(&xml_data).await.expect("failed_xml_write");

	//now do the xsd data
	let xsd_node_id = xsd_data.node_id.unwrap();
	let xsd_socket_id = xsd_data.socket_id.unwrap();
	let xsd_key = format!("{}::{}::{}", &process_id, &xsd_node_id, &xsd_socket_id);

	println!("[SDMX Parser]: fetching XSD data");
	let xsd_data = match get_store_value(xsd_key, store).await {
		Some(v) => v,
		None => return Err("no_xsd_data".into())
	};

	let xsd_data = xsd_data.replace("\"", "");
	let xsd_data = general_purpose::STANDARD.decode(xsd_data).unwrap();
	let xsd_file_id = Uuid::new_v4().to_string();
	let xsd_file_loc = format!("./data/{}.xsd", xsd_file_id);

	println!("[SDMX Parser]: creating xsd file");
	let xsd_file = File::create(&xsd_file_loc)
		.await
		.expect("failed_create_xsd_file");

	let mut xsd_buffer = BufWriter::new(xsd_file);
	xsd_buffer.write_all(&xsd_data).await.expect("failed_xsd_write");

	//now parse the actual sdmx
	println!("[SDMX Parser]: parsing into series");
	let sdmx_series = match sdmx_data_parser(
		xml_file_loc.clone(),
		xsd_file_loc.clone()
	) {
		Ok(v) => v,
		Err(_) => return Err("failed_sdmx_parse".into())
	};

	println!("[SDMX Parser]: fetched {} indicators", &sdmx_series.len());
	if sdmx_series.len() > 0 {
		println!("{:?}", &sdmx_series.get(0));
	}

	let series_str = serde_json::to_string(&sdmx_series).unwrap();
	let socket_id = output_ids[0].clone();
	let series_key = format!("{}::{}::{}", process_id, node_id, socket_id);
	set_store_value(series_key, series_str, store).await;

	//delete the files
	remove_file(xml_file_loc).await.unwrap();
	remove_file(xsd_file_loc).await.unwrap();

	Ok("Parsed SDMX Data".into())
}