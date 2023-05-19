use actix_web::web;
use base64::{engine::general_purpose, Engine};
use basteh::Basteh;
use serde::{Serialize, Deserialize};
use tokio::{io::{BufWriter, AsyncWriteExt}, fs::{File, remove_file}};
use uuid::Uuid;
use crate::{handler::{messages, socket_store::{get_store_value, set_store_value}}, sdmx_parser};
use crate::handler::{Result, socket_response, functions::types};

#[derive(Debug, Deserialize, Serialize)]
pub struct SDMXFunctionData {
    pub xml_data: Option<types::InternalStore>,
    pub xsd_data: Option<types::InternalStore>
}

pub async fn socket_sdmx_parser(
    request_id: String,
    node_id: String,
    process_id: String,
    socket_data: String,
    output_ids: Vec<String>,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: SDMXFunctionData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing error, check data validity".into())
    };

    if body.xml_data.is_none() || body.xsd_data.is_none() {
        return Err("function needs SDMX data".into())
    }

    let xml_data = body.xml_data.unwrap();
    let xsd_data = body.xsd_data.unwrap();

    let xml_node = xml_data.node_id.expect("requires xml node id");
    let xml_socket = xml_data.socket_id.expect("requires xml socket id");

    let xsd_node = xsd_data.node_id.expect("requires xsd node id");
    let xsd_socket = xsd_data.socket_id.expect("requires xsd socket id");
    
    let xml_data = get_store_value(&process_id, &xml_node, &xml_socket, data_store).await?;
    let xml_data = xml_data.to_string();
    let xml_data = xml_data.replace("\"", "");
    let xml_data = general_purpose::STANDARD.decode(xml_data).unwrap();


    let xsd_data = get_store_value(&process_id, &xsd_node, &xsd_socket, data_store).await?;
    let xsd_data = xsd_data.to_string();
    let xsd_data = xsd_data.replace("\"", "");
    let xsd_data = general_purpose::STANDARD.decode(xsd_data).unwrap();

    let xml_file_id = Uuid::new_v4().to_string();
    let xml_file_loc = format!("./data/{}.xml", xml_file_id);

    let xml_file = File::create(xml_file_loc.clone()).await.expect("failed to create the xml file");
    let mut xml_buffer = BufWriter::new(xml_file); 
    xml_buffer.write_all(&xml_data).await.expect("failed to write xml file");

    let xsd_file_id = Uuid::new_v4().to_string();
    let xsd_file_loc = format!("./data/{}.xsd", xsd_file_id);

    let xsd_file = File::create(xsd_file_loc.clone()).await.expect("failed to create xsd file");
    let mut xsd_buffer = BufWriter::new(xsd_file);
    xsd_buffer.write_all(&xsd_data).await.expect("failed to write xsd file");

    let sdmx_series = sdmx_parser::parse_sdml_ml(
        xml_file_loc.clone(), 
        xsd_file_loc.clone()
    );

    let indicator_str = serde_json::to_string(&sdmx_series)?;
    let socket_id = output_ids[0].clone();
    set_store_value(&process_id, &node_id, &socket_id, &indicator_str, data_store).await;

    //delete the temporary files
    remove_file(xml_file_loc).await.unwrap();
    remove_file(xsd_file_loc).await.unwrap();

    Ok(socket_response(String::from("Parsed SDMX Data"), false, request_id))
}