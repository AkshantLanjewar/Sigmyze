use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct LoadResponse {
    #[serde(rename="loopLength")]
    loop_length: usize
}

impl LoadResponse {
    pub fn new(loop_length: usize) -> Self {
        Self { loop_length: loop_length }
    }
}