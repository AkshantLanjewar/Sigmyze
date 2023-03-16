use std::{fs::File, io::BufReader};


mod sdmx_ml;
mod sdmx_data;

pub fn parse_sdml_ml(xml_path: String, xsd_path: String) {
    let _xsd_defs = sdmx_ml::parse_xsd(xsd_path);
    println!("{:#?}", _xsd_defs);

    let xml_file = File::open(xml_path).unwrap();
    let _xml_buf = BufReader::new(xml_file);
}