use actix_web::{web};
use basteh::Basteh;
use super::messages::{self, SocketResponse};
use std::{error, path::Path, fs::File, io::{Write, Read}};

type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

fn socket_response(msg: String, error: bool, request_id: String) -> SocketResponse {
    messages::SocketResponse {
        error: error,
        message: msg,
        request_id: request_id
    }
}

async fn store_file(query: String, data: String, data_store: &web::Data<Basteh>) {
    let path = "./data";
    if Path::new(path).is_dir() == false {
        std::fs::create_dir(path).unwrap();
    }

    let file_path = String::from("./data/") + &query + &String::from(".bin");
    let mut file = File::create(file_path).unwrap();

    file.write_all(data.as_bytes()).unwrap();
    data_store.set(query, "file").await.unwrap();
}

pub async fn set_output_value(
    request_id: String, 
    socket_data: String, 
    process_id: String, 
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: messages::SetOutputValueData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check socket data validity".into())
    };

    let node_id = match body.node_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define node_id in the socket data".into())
    };

    let socket_id = match body.socket_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define socket_id in the socket data".into())
    };

    let value = match body.value {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define value in the socket data".into())
    };

    let store_query = format!("{}-{}-{}", process_id, node_id, socket_id);
    let string_value = value.to_string();
    if string_value.len() > 5_000_000 {
        store_file(store_query, string_value, data_store).await;
    } else {
        data_store.set(store_query, string_value).await.unwrap();
    }

    Ok(socket_response(String::from("set_value"), false, request_id))
}

pub async fn get_output_value(
    request_id: String, 
    socket_data: String, 
    process_id: String, 
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: messages::GetOutputValueData = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("JSON Parsing Error, check socket data validity".into())
    };

    let node_id = match body.node_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define node_id in the socket data".into())
    };

    let socket_id = match body.socket_id {
        Some(val) => val,
        None => return Err("SetOutputValue Error, please define socket_id in the socket data".into())
    };

    let store_query = format!("{}-{}-{}", process_id, node_id, socket_id);
    let mut value_string = data_store.get::<String>(store_query).await.unwrap().unwrap();
    if value_string == "file" {
        let file_path = format!("./data/{}-{}-{}.bin", process_id, node_id, socket_id);
        let mut file = File::open(file_path).unwrap();
        let mut buf = Vec::<u8>::new();
        file.read_to_end(&mut buf).unwrap();

        value_string = std::str::from_utf8(&buf).unwrap().to_string();
    }

    let value: serde_json::Value = serde_json::from_slice(value_string.as_bytes())?;

    let data = messages::GetOutputValueResponse { 
        value: value
    };

    Ok(socket_response(serde_json::to_string(&data)?, false, request_id))
}