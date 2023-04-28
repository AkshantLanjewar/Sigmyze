use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};

use crate::handler::{messages, Result, functions::{socket_response, SERVER_URL, types::GetIndicatorsResp}};

#[derive(Debug, Deserialize, Serialize)]
struct LoadIndicatorsAnalysisBody {
    #[serde(rename="organizationId")]
    pub organization_id: Option<String>,

    #[serde(rename="quantaId")]
    pub quanta_id: Option<String>
}

pub async fn load_indicators_analysis(
    request_id: String,
    process_id: String,
    socket_data: String,
    data_store: &web::Data<Basteh>
) -> Result<messages::SocketResponse> {
    let body: LoadIndicatorsAnalysisBody = match serde_json::from_slice(socket_data.as_bytes()) {
        Ok(body) => body,
        Err(_) => return Err("json_error".into())
    };

    let organization_id = body.organization_id.expect("bad_organization_id");
    let quanta_id = body.quanta_id.expect("bad_quanta_id");

    let url = format!("{}/api/v2/quanta/indicators_all/{}/{}/{}", SERVER_URL, organization_id, quanta_id, process_id);
    let client = reqwest::Client::new();
    let res = client.get(url)
        .send()
        .await?
        .text()
        .await?;

    let indicator_resp: GetIndicatorsResp = serde_json::from_str(res.as_str()).expect("bad_resp");
    let resp_status = indicator_resp.status.unwrap();
    if resp_status.error == true {
        return Ok(socket_response(String::from("bad_resp_status"), false, request_id))
    }

    let indicators = indicator_resp.indicators.unwrap();
    let indicator_str = serde_json::to_string(&indicators)?;
    let storage_loc = format!("{}::indicators", &process_id);
    data_store.set(storage_loc, indicator_str).await.unwrap();

    Ok(socket_response(String::from("success"), false, request_id))
}