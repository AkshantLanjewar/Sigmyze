use actix_web::web;
use basteh::Basteh;
use serde::{Deserialize, Serialize};

use crate::handler::{messages, Result, functions::{socket_response, SERVER_URL, types::{GetIndicatorsResp, GetIndicatorLengthResp, QuantaIndicator}}};

#[derive(Debug, Deserialize, Serialize)]
struct LoadIndicatorsAnalysisBody {
    #[serde(rename="organizationId")]
    pub organization_id: Option<String>,

    #[serde(rename="quantaId")]
    pub quanta_id: Option<String>
}

const PAGE_LENGTH: i32 = 1000;

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
    let client = reqwest::Client::new();

    let length_url = format!(
        "{}/api/v2/quanta/public/indicators_length/{}/{}/{}", 
        SERVER_URL, 
        organization_id, 
        quanta_id, 
        process_id
    );

    let length_res = client.get(length_url)
        .send()
        .await?
        .text()
        .await?;

    let length_resp: GetIndicatorLengthResp = serde_json::from_str(&length_res).expect("length_parse_err");
    let indicators_length = length_resp.length.expect("malformed_req");

    let mut collected_indicators: Vec<QuantaIndicator> = Vec::new();
    let mut curr_page = 0;

    while (curr_page) * PAGE_LENGTH < indicators_length {
        let indicator_url = format!(
            "{}/api/v2/quanta/public/indicators_paged/{}/{}/{}/{}/{}", 
            SERVER_URL, 
            PAGE_LENGTH,
            curr_page,
            organization_id, 
            quanta_id, 
            process_id
        );

        let indicator_res = client.get(indicator_url)
            .send()
            .await?
            .text()
            .await?;

        let indicator_resp: GetIndicatorsResp = serde_json::from_str(&indicator_res).expect("indicator_parse_error");
        let mut indicators = indicator_resp.indicators.expect("malformed_indicator");
        collected_indicators.append(&mut indicators);
        curr_page = curr_page + 1;
    }

    let indicator_str = serde_json::to_string(&collected_indicators)?;
    let storage_loc = format!("{}::indicators", &process_id);
    data_store.set(storage_loc, indicator_str).await.unwrap();

    Ok(socket_response(String::from("success"), false, request_id))
}