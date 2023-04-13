use actix_web::web;
use base64::{engine::general_purpose, Engine};
use basteh::Basteh;
use serde::{Deserialize, Serialize};
use tokio::{fs::File, io::{BufWriter, AsyncWriteExt}};

use crate::handler::{Result, messages, functions::{socket_response}};

#[derive(Debug, Deserialize, Serialize)]
struct CompileProjectBody {
    data: Option<String>
}

pub async fn compile_project(
    request_id: String,
    process_id: String,
    socket_data: String,
    _data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: CompileProjectBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check function data validity".into())
    };

    let zip_data = body.data.expect("requires data");
    let zip_data = zip_data.replace("\"", "");
    let zip_data = general_purpose::STANDARD.decode(zip_data).expect("bad_zip");
    let zip_loc = format!("./data/{}.zip", &process_id);

    let zip_file = File::create(zip_loc).await.expect("failed to create zip file");
    let mut zip_buffer = BufWriter::new(zip_file);
    zip_buffer.write_all(&zip_data).await.expect("failed to write zip data");

    Ok(socket_response(String::from("change"), false, request_id))
}