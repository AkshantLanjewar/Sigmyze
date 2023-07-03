use serde::{Deserialize, Serialize};

use crate::handler::{SERVER_URL, IStatus};

use super::types::InternalStorePreload;

#[derive(Debug, Deserialize, Serialize)]
struct FetchPreloadedDataResponse {
    pub status: Option<IStatus>,
    pub documents: Option<Vec<InternalStorePreload>>
}

pub async fn fetch_preload_data(token: String) -> Option<Vec<InternalStorePreload>> {
    let url = format!("{}/api/v2/quanta/execution/fetch/{}", SERVER_URL, token);
    let client = reqwest::Client::new();
    
    let response = client.get(url)
        .send()
        .await;

    let text = match response {
        Ok(v) => v.text().await.unwrap(),
        Err(_) => return None
    };

    let parsed_response: FetchPreloadedDataResponse = match serde_json::from_str(&text) {
        Ok(v) => v,
        Err(_) => return None
    };

    if parsed_response.documents.is_none() || parsed_response.status.is_none() {
        return None
    }

    let documents = parsed_response.documents.unwrap();
    let status = parsed_response.status.unwrap();
    if status.validate_status() == None {
        return None
    }

    Some(documents)
}

pub async fn delete_preload_data(token: String) {
    let url = format!("{}/api/v2/quanta/execution/delete/{}", SERVER_URL, token);
    let client = reqwest::Client::new();

    let _response = client.get(url)
        .send()
        .await;
}