use std::fmt::Debug;

use chrono::{DateTime, Utc, serde::ts_seconds};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Clone)]
pub struct ChartData {
    #[serde(with = "ts_seconds", rename="xValue")]
    pub x_val: DateTime<Utc>,

    #[serde(rename = "yValue")]
    pub y_val: f32,
}

impl ChartData {
    pub fn new(x_val: DateTime<Utc>, y_val: f32) -> Self {
        Self {
            x_val: x_val,
            y_val: y_val
        }
    }
}

impl Debug for ChartData {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("ChartData")
            .field("x", &self.x_val)
            .field("y", &self.y_val)
            .finish()
    }
}