use std::fmt::Debug;

use chrono::{DateTime, Utc};

#[derive(Clone)]
pub struct ChartData {
    pub x_val: DateTime<Utc>,
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