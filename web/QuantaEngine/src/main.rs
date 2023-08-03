use std::{net::SocketAddr, sync::Arc, path::Path};

mod handler;
mod data_store;
mod sdmx_parser;

use data_store::{QuantaDataStore, DATA_PATH};
use log::*;
use tokio::{net::{TcpListener, TcpStream}, sync::Mutex, fs};
use tokio_tungstenite::{tungstenite::{Result, Error}, accept_async};
use futures_util::stream::StreamExt;
use tokio_tungstenite::tungstenite::protocol::WebSocketConfig;

use crate::handler::handle_text_msg;

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    env_logger::init();
    let server = TcpListener::bind("localhost:5025").await;
    let server = server.expect("failed to bind");
    let store = Arc::new(Mutex::new(QuantaDataStore::init()));

    //initialize the data folder
    if Path::new(DATA_PATH).is_dir() == false {
        fs::create_dir(DATA_PATH).await.unwrap();
    }

    //handle the websockets
    println!("accepting connections on {:?}", server.local_addr().unwrap().to_string());
    while let Ok((stream, _)) = server.accept().await {
        let store_clone = store.clone();
        let peer = stream.peer_addr().expect("requires_peer");
        tokio::spawn(async move {
            accept_connection(peer, stream, &store_clone).await;
        });
    }
}

async fn accept_connection(
    peer: SocketAddr, 
    stream: TcpStream, 
    store: &Arc<Mutex<QuantaDataStore>>
) {
    if let Err(e) = handle_connection(peer, stream, store).await {
        match e {
            Error::ConnectionClosed | Error::Protocol(_) | Error::Utf8 => (),            
            err => error!("Error in connection: {}", err)
        }
    }
}

async fn handle_connection(
    peer: SocketAddr, 
    stream: TcpStream,
    store: &Arc<Mutex<QuantaDataStore>>
) -> Result<()> {
    let mut ws_stream = accept_async(stream).await.expect("failed_accept");
    info!("New Connection {}", peer);

    while let Some(msg) = ws_stream.next().await {
        let msg = msg?;
        if msg.is_text() == false {
            continue;
        }

        let msg_text = msg.to_text()?;
        let store_clone = store.clone();
        handle_text_msg(&mut ws_stream, &store_clone, msg_text).await?;
    }

    Ok(())
}