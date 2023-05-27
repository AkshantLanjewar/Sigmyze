use quick_xml::events::Event;
use quick_xml::Reader;
use rustc_hash::FxHashMap;
use crate::handler::functions::quanta_data::ChartData;
use crate::sdmx_parser::types::{SDMXSeries, SDMXSeriesFields};

pub fn parse_xml(xml_path: &String, xsd_defs: &SDMXSeriesFields) -> Vec<SDMXSeries> {
	let mut depth = 0;
	let mut depth_map: FxHashMap<i32, Option<SDMXSeries>> = FxHashMap::default();
	let mut collected_series: Vec<SDMXSeries> = Vec::new();

	let mut reader = Reader::from_file(xml_path).unwrap();
	let mut buf = Vec::new();

	loop {
		match reader.read_event_into(&mut buf) {
			Ok(Event::Eof) => break,

			Ok(Event::Start(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name = tag_name.as_str();

				match tag_name {
					"Series" => {
						let mut sdmx_series = SDMXSeries::new();
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();

							let attr_name = &attribute.key;
							let attr_name = String::from_utf8(attr_name
								.as_ref()
								.to_vec()
							).unwrap();

							let attr_value = &attribute.value;
							let attr_value = String::from_utf8(attr_value
								.as_ref()
								.to_vec()
							).unwrap();

							let xsd_series = xsd_defs.get_series_name(
								&attr_name
							);
							if xsd_series.is_some() {
								let xsd_series = xsd_series.unwrap().clone();
								let xsd_values = xsd_series.field_values;

								for xsd_value in xsd_values.iter() {
									let field_value = xsd_value.field_value.as_str();
									let field_doc = xsd_value.field_documentation.as_str();

									if attr_value.as_str() == field_value {
										let field_value = String::from(field_value);
										let field_doc = String::from(field_doc);
										sdmx_series.add_field(
											attr_name.clone(),
											field_value,
											field_doc
										);
									}
								}
							}
						}

						depth_map.insert(depth, Some(sdmx_series));
						depth += 1;
					},

					_ => {}
				}
			}

			Ok(Event::Empty(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name = tag_name.as_str();

				match tag_name {
					"Obs" => {
						if depth == 0 {
							continue;
						}

						let series_depth = &depth - 1;
						let series = depth_map.get(&series_depth).unwrap();
						if series.is_none() {
							continue;
						}

						let mut series = series.clone().unwrap();
						let mut frequency: Option<&str> = None;
						for series_field in series.series_fields.iter() {
							if series_field.field_key == "FREQ" {
								frequency = Some(series_field.field_value.as_str());
							}
						}

						let mut time_period: Option<String> = None;
						let mut observation: Option<String> = None;
						if frequency.is_none() {
							continue;
						}

						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();

							let attr_name = &attribute.key;
							let attr_name = String::from_utf8(attr_name
								.as_ref()
								.to_vec()
							).unwrap();

							let attr_value = &attribute.value;
							let attr_value = String::from_utf8(attr_value
								.as_ref()
								.to_vec()
							).unwrap();

							let attr_name_str = attr_name.as_str();
							match attr_name_str {
								"TIME_PERIOD" => time_period = Some(attr_value),

								"OBS_VALUE" => observation = Some(attr_value),

								_ => {}
							}
						}

						if time_period.is_none() || observation.is_none() {
							continue;
						}

						let frequency = String::from(frequency.unwrap());
						let time_period = time_period.unwrap();
						let time_period = SDMXSeries::parse_date(
							&frequency,
							&time_period
						);
						if time_period.is_some() {
							let observation = observation.unwrap();
							if observation == "n/a" {
								continue;
							}

							let time_period = time_period.unwrap();
							let y_value = observation.parse::<f32>();
							if y_value.is_err() {
								continue;
							}

							let y_value = y_value.unwrap();
							let chart_point = ChartData::new(time_period, y_value);
							series.chart_data.push(chart_point);
						}

						depth_map.insert(series_depth, Some(series));
					}

					_ => {}
				}
			}

			Ok(Event::End(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name = tag_name.as_str();

				match tag_name {
					"Series" => {
						depth -= 1;

						let series = depth_map.get(&depth).unwrap();
						if series.is_none() {
							continue;
						}

						let series = series.clone().unwrap();
						collected_series.push(series);
					}

					_ => {}
				}
			}

			_ => {}
		}

		buf.clear();
	}

	return collected_series
}