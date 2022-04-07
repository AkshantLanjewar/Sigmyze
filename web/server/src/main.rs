use std::{fs::File, io::BufReader};

use actix::prelude::*;

use actix_web::{
    http::header::ContentType,
    middleware,
    get,
    App,
    HttpRequest,
    HttpResponse,
    HttpServer,
};

use log::debug;
use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, pkcs8_private_keys};

use crate::data::scheduler::Scheduler;
mod data;

//hello handler
#[get("/")]
async fn index(req: HttpRequest) -> HttpResponse {
    debug!("{:?}", req);

    HttpResponse::Ok()
        .content_type(ContentType::plaintext())
        .body("Swag")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));
    let config = load_rustls_config();
    log::info!("starting HTTPS server at http://localhost:8443");

    data::scheduler::Scheduler.start();

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(index)
    })
    .bind_rustls("127.0.0.1:8443", config)?
    .run()
    .await
}

fn load_rustls_config() -> rustls::ServerConfig {
    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth();
    
    //load tls cert files
    let cert_file = &mut BufReader::new(File::open("keys/cert.pem").unwrap());
    let key_file  = &mut BufReader::new(File::open("keys/key.pem").unwrap());

    let cert_chain = certs(cert_file)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();
    let mut keys: Vec<PrivateKey> = pkcs8_private_keys(key_file)
        .unwrap()
        .into_iter()
        .map(PrivateKey)
        .collect();

    if keys.is_empty() {
        eprintln!("Could not locate PKCS 8 private keys.");
        std::process::exit(1);
    }

    config.with_single_cert(cert_chain, keys.remove(0)).unwrap()
}