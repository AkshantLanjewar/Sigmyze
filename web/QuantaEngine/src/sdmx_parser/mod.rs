use crate::sdmx_parser::types::SDMXSeries;
use crate::sdmx_parser::xml::parse_xml;
use crate::sdmx_parser::xsd::parse_xsd;

mod xsd;
pub mod types;
mod xml;

pub fn sdmx_data_parser(xml_path: String, xsd_path: String) -> Result<Vec<SDMXSeries>, String> {
	let xsd_defs = parse_xsd(xsd_path);
	Ok(parse_xml(&xml_path, &xsd_defs))
}