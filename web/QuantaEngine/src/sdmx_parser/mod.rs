use self::sdmx_series::SDMXSeries;

mod sdmx_xsd;
mod sdmx_xml;
mod sdmx_xsd_data;
mod sdmx_series;

//function that parses sdmx and returns a list of our SDMXSeries structure
pub fn parse_sdml_ml(xml_path: String, xsd_path: String) -> Vec<SDMXSeries> {
    let xsd_defs = sdmx_xsd::parse_xsd(xsd_path);
    sdmx_xml::parse_xml(&xml_path, &xsd_defs)
}