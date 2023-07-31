use std::fmt::Debug;
use chrono::{DateTime, Utc};
use dateparser::parse_with_timezone;
use serde::{Serialize, Deserialize};
use crate::handler::functions::quanta_data::ChartData;

#[derive(Clone)]
pub struct SDMXSeriesFieldValue {
	pub field_value: String,
	pub field_documentation: String
}

impl SDMXSeriesFieldValue {
	fn new(value: String, documentation: String) -> Self {
		Self {
			field_value: value,
			field_documentation: documentation
		}
	}
}

impl Debug for SDMXSeriesFieldValue {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		f.debug_struct("SDMXSeriesFieldValue")
			.field("field_value", &self.field_value)
			.field("field_documentation", &self.field_documentation)
			.finish()
	}
}

#[derive(Clone)]
pub struct SDMXSeriesField {
	pub field_key: String,
	pub field_type: String,
	pub field_values: Vec<SDMXSeriesFieldValue>
}

impl SDMXSeriesField {
	pub fn new(field_key: String, field_type: String) -> Self {
		Self {
			field_key: field_key,
			field_type: field_type,
			field_values: Vec::new()
		}
	}

	pub fn add_value(&mut self, value: String, documentation: String) {
		let n_value = SDMXSeriesFieldValue::new(value, documentation);
		self.field_values.push(n_value);
	}
}

impl Debug for SDMXSeriesField {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		f.debug_struct("SDMXSeriesField")
			.field("field_key", &self.field_key)
			.field("field_type", &self.field_type)
			.field("field_values", &self.field_values)
			.finish()
	}
}

#[derive(Clone)]
pub struct SDMXSeriesFields {
	pub series_fields: Vec<SDMXSeriesField>
}

impl Debug for SDMXSeriesFields {
	fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		f.debug_list()
			.entries(&self.series_fields)
			.finish()
	}
}

impl SDMXSeriesFields {
	pub fn new() -> Self {
		Self {
			series_fields: Vec::new()
		}
	}

	//adds a type to the series fields
	pub fn add_type(&mut self, field_type: &String) {
		let internal_type = field_type.as_str();
		for series_field in self.series_fields.iter() {
			if series_field.field_type == internal_type {
				return;
			}
		}

		//create a new type
		let n_series = SDMXSeriesField::new(
			String::from(""),
			String::from(internal_type)
		);

		self.series_fields.push(n_series);
	}

	pub fn add_type_value(&mut self, field_type: &String, field_value: &String, field_documentation: &String) {
		let internal_type = field_type.as_str();
		let internal_value = field_value.as_str();
		let internal_documentation = field_documentation.as_str();

		let mut field_index = 0;
		let mut field: Option<SDMXSeriesField> = None;
		for (i, series_field) in self.series_fields.iter().enumerate() {
			if series_field.field_type.as_str() == internal_type {
				field_index = i;
				field = Some(series_field.clone());
			}
		}

		if field.is_none() {
			//build a new field
			let mut n_series = SDMXSeriesField::new(
				String::from(""),
				String::from(internal_type)
			);

			n_series.add_value(String::from(internal_value), String::from(internal_documentation));
			self.series_fields.push(n_series);
		} else {
			let mut field = field.unwrap();
			field.add_value(String::from(internal_value), String::from(internal_documentation));
			self.series_fields[field_index] = field;
		}
	}

	pub fn add_field_key(&mut self, field_key: &String, field_type: &String) {
		let internal_key = field_key.as_str();
		let internal_type = field_type.as_str();

		let mut field_index = 0;
		let mut field: Option<SDMXSeriesField> = None;
		for (i, series_field) in self.series_fields.iter().enumerate() {
			if series_field.field_type.as_str() == internal_type {
				field_index = i;
				field = Some(series_field.clone());
			}
		}

		if field.is_none() {
			//build a new field
			let n_series = SDMXSeriesField::new(
				String::from(internal_key),
				String::from(internal_type)
			);

			self.series_fields.push(n_series);
		} else {
			let mut field = field.unwrap();
			field.field_key = String::from(internal_key);
			self.series_fields[field_index] = field;
		}
	}

	pub fn get_series_name(&self, key: &String) -> Option<&SDMXSeriesField> {
		let mut selected_series: Option<&SDMXSeriesField> = None;
		for series in self.series_fields.iter() {
			if series.field_key.as_str() == key.as_str() {
				selected_series = Some(series);
			}
		}

		return selected_series;
	}
}

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