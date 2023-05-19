use std::fmt::Debug;
use chrono::{DateTime, Utc};
use dateparser::parse_with_timezone;
use serde::{Deserialize, Serialize};

use crate::quanta_dataset::ChartData;

#[derive(Clone, Deserialize, Serialize)]
pub struct SDMXSeries {
    #[serde(rename = "chartData")]
    pub chart_data: Vec<ChartData>,

    #[serde(rename = "seriesFields")]
    pub series_fields: Vec<SDMXField>
}

impl SDMXSeries {
    pub fn new() -> Self {
        Self {
            chart_data: Vec::new(),
            series_fields: Vec::new()
        }
    }

    pub fn parse_date(frequency: &String, date: &String) -> Option<DateTime<Utc>> {
        let mut padded_date: Option<String> = None;
        let internal_freq = frequency.as_str();

        match internal_freq {
            "A" => padded_date = Some(format!("{}-01-01", date)),
            
            _ => {}
        }

        let mut date: Option<DateTime<Utc>> = None;
        if padded_date.is_some() {
            let padded_date = padded_date.unwrap();
            let parsed = parse_with_timezone(&padded_date, &Utc);
            if parsed.is_ok() {
                let parsed = parsed.unwrap();
                date = Some(parsed);
            }
        }

        date
    }

    pub fn add_field(&mut self, key: String, value: String, documentation: String) {
        let n_field = SDMXField::new(key, value, documentation);
        self.series_fields.push(n_field);
    }
}

impl Debug for SDMXSeries {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("SDMXSeries")
            .field("series_fields", &self.series_fields)
            .field("chart_data", &self.chart_data)
            .finish()
    }
}

#[derive(Clone, Deserialize, Serialize)]
pub struct SDMXField {
    #[serde(rename = "fieldKey")]
    pub field_key: String,

    #[serde(rename = "fieldValue")]
    pub field_value: String,

    #[serde(rename = "fieldDocumentation")]
    pub field_documentation: String
}

impl SDMXField {
    pub fn new(key: String, value: String, documentation: String) -> Self {
        Self {
            field_key: key,
            field_value: value,
            field_documentation: documentation
        }
    }
}

impl Debug for SDMXField {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("SDMXField")
            .field("field_key", &self.field_key)
            .field("field_value", &self.field_value)
            .field("field_documentation", &self.field_documentation)
            .finish()
    }
}