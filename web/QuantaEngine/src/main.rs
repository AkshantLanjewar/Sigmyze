use actix_web::{HttpResponse, Error, HttpServer, HttpRequest, web, App, middleware, rt};
use basteh::Basteh;
mod handler;

#[actix_web::get("/")]
async fn handle_ws(req: HttpRequest, stream: web::Payload, data_store: web::Data<Basteh>) -> Result<HttpResponse, Error> {
    let (res, session, msg_stream) = actix_ws::handle(&req, stream)?;

    //spwan the socket handler
    rt::spawn(handler::ws_connection(session, msg_stream, data_store));

    Ok(res)
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    log::info!("starting the quanta socket service");

    let provider = basteh_memory::MemoryBackend::start_default();
    let data_store = Basteh::build().provider(provider).finish();
    let data_store = web::Data::new(data_store);

    HttpServer::new(move || {
        App::new()
            .app_data(data_store.clone())
            .service(handle_ws)
            .wrap(middleware::Logger::default())
    })
    .workers(2)
    .bind(("127.0.0.1", 5025))?
    .run()
    .await
}
