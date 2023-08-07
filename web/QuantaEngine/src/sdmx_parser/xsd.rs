use quick_xml::events::Event;
use quick_xml::Reader;
use rustc_hash::FxHashMap;
use crate::sdmx_parser::types::SDMXSeriesFields;

pub fn parse_xsd(path: String) -> SDMXSeriesFields {
	let mut sdmx_series_fields = SDMXSeriesFields::new();
	let mut depth = 0;
	let mut depth_map: FxHashMap<i32, Option<String>> = FxHashMap::default();

	let mut reader = Reader::from_file(path).unwrap();
	let mut buf = Vec::new();

	loop {
		match reader.read_event_into(&mut buf) {
			Ok(Event::Eof) => break,

			Ok(Event::Start(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name: Vec<&str> = tag_name.split(":").collect();
				let tag_name = tag_name[1];

				match tag_name {
					"simpleType" => {
						let mut field_name: Option<String> = None;
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();
							let attr_name = &attribute.key;

							if attr_name.as_ref() == b"name" {
								field_name = Some(String::from_utf8(attribute
									.value
									.as_ref()
									.to_vec()
								).unwrap());
							}
						}

						//get the type
						if field_name.is_some() {
							let field_name = field_name.unwrap();
							sdmx_series_fields.add_type(&field_name);

							depth_map.insert(depth, Some(field_name.clone()));
							depth += 1;
						}
					},

					"complexType" => {
						let mut series_name: Option<String> = None;
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();
							let attr_name = &attribute.key;

							if attr_name.as_ref() == b"name" {
								series_name = Some(String::from_utf8(attribute
									.value
									.as_ref()
									.to_vec()
								).unwrap());
							}
						}

						if series_name.is_some() {
							let series_name = series_name.unwrap();
							if series_name != "SeriesType" {
								continue;
							}

							depth_map.insert(depth, Some(series_name.clone()));
							depth += 1;
						}
					},

					"attribute" => {
						if depth == 0 {
							continue;
						}

						let mut attribute_name: Option<String> = None;
						let mut attribute_type: Option<String> = None;
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();
							let attr_name = &attribute.key;

							if attr_name.as_ref() == b"name" {
								attribute_name = Some(String::from_utf8(attribute
									.value.as_ref().to_vec()).unwrap());
							}

							if attr_name.as_ref() == b"type" {
								attribute_type = Some(String::from_utf8(attribute
									.value.as_ref()
									.to_vec())
									.unwrap()
								);
							}
						}

						if attribute_name.is_none() || attribute_type.is_none() {
							continue;
						}

						let attribute_name = attribute_name.unwrap();
						let attribute_type = attribute_type.unwrap();
						sdmx_series_fields.add_field_key(
							&attribute_name,
							&attribute_type
						);

					}

					"enumeration" => {
						if depth == 0 {
							continue;
						}

						let mut field_value: Option<String> = None;
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();
							let attr_name = &attribute.key;

							if attr_name.as_ref() == b"value" {
								field_value = Some(String::from_utf8(attribute
									.value
									.as_ref()
									.to_vec()
								).unwrap());
							}
						}

						if field_value.is_some() {
							let field_value = field_value.unwrap();
							if field_value == "NULL" {
								continue;
							}

							depth_map.insert(depth, Some(field_value.clone()));
							depth += 1;
						}
					}

					"documentation" => {
						if depth < 2 {
							continue;
						}

						depth_map.insert(depth, Some(String::from("collect_text")));
					}

					_ => {}
				}
			}

			Ok(Event::Empty(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name: Vec<&str> = tag_name.split(":").collect();

				let _namespace = tag_name[0];
				let tag_name = tag_name[1];

				match tag_name {
					"attribute" => {
						if depth == 0 {
							continue;
						}

						let mut attribute_name: Option<String> = None;
						let mut attribute_type: Option<String> = None;
						for attribute in e.attributes().into_iter() {
							let attribute = attribute.unwrap();
							let attr_name = &attribute.key;

							if attr_name.as_ref() == b"name" {
								attribute_name = Some(String::from_utf8(attribute
									.value
									.as_ref()
									.to_vec()
								).unwrap());
							}

							if attr_name.as_ref() == b"type" {
								attribute_type = Some(String::from_utf8(attribute
									.value
									.as_ref()
									.to_vec()
								).unwrap());
							}
						}

						if attribute_name.is_none() || attribute_type.is_none() {
							continue;
						}

						let attribute_name = attribute_name.unwrap();
						let attribute_type = attribute_type.unwrap();
						sdmx_series_fields.add_field_key(
							&attribute_name,
							&attribute_type
						);
					}

					_ => {}
				}
			}

			Ok(Event::Text(e)) => {
				let depth_value = depth_map.get(&depth);
				if depth_value.is_none() {
					continue;
				}

				let depth_value = depth_value.clone().unwrap();
				if depth_value.is_none() {
					continue;
				}

				let depth_value = depth_value.clone().unwrap();
				if depth_value != "collect_text" {
					continue;
				}

				let text_content = e.as_ref().to_vec();
				let text_content = String::from_utf8(text_content).unwrap();
				depth_map.insert(depth, Some(text_content));
			}

			Ok(Event::End(e)) => {
				let tag_name = &e.name();
				let tag_name = String::from_utf8(tag_name.as_ref().to_vec()).unwrap();
				let tag_name: Vec<&str> = tag_name.split(":").collect();
				let tag_name = tag_name[1];

				match tag_name {
					"simpleType" => {
						if depth == 0 {
							continue;
						}

						depth -= 1;
						println!("{:?}", depth_map.insert(depth, None));
					},

					"complexType" => {
						if depth == 0 {
							continue;
						}

						depth -= 1;
						println!("{:?}", depth_map.insert(depth, None));
					}

					"enumeration" => {
						if depth == 0 {
							continue;
						}

						depth -= 1;
						println!("{:?}", depth_map.insert(depth, None));
					},

					"documentation" => {
						if depth < 2 {
							continue;
						}

						let documentation_value = depth_map.get(&depth);
						let enumeration_value = depth_map.get(&(&depth - 1));
						let simple_type = depth_map.get(&(&depth - 2));
						if documentation_value.is_none() || enumeration_value.is_none() || simple_type.is_none() {
							continue;
						}

						let documentation_value = documentation_value.unwrap();
						let enumeration_value = enumeration_value.unwrap();
						let simple_type = simple_type.unwrap();
						if documentation_value.is_none() || enumeration_value.is_none() || simple_type.is_none() {
							continue;
						}

						let simple_type = simple_type.clone().unwrap();
						let enumeration_value = enumeration_value.clone().unwrap();
						let documentation_value = documentation_value.clone().unwrap();

						println!("{:?}", depth_map.insert(depth, None));
						sdmx_series_fields.add_type_value(
							&simple_type,
							&enumeration_value,
							&documentation_value
						);
					}

					_ => {}
				}
			}

			_ => ()
		}

		buf.clear();
	}

	return sdmx_series_fields
}