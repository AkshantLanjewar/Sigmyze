use serde::{Deserialize, Serialize};
use serde_json::{json, Value, Map};

#[derive(Debug, Deserialize, Serialize)]
pub struct BabelRc {
	pub presets: Option<Vec<Value>>,
	pub plugins: Option<Vec<Value>>
}

impl BabelRc {
	pub fn default_config() -> Self {
		let mut presets_arr: Vec<Value> = Vec::new();
		presets_arr.push("@babel/preset-react".into());

		let mut plugins_arr: Vec<Value> = Vec::new();
		let mut react_plugin: Vec<Value> = Vec::new();

		react_plugin.push("@babel/plugin-transform-react-jsx".into());
		react_plugin.push(json!({ "runtime": "automatic" }));
		plugins_arr.push(react_plugin.into());

		Self { presets: Some(presets_arr), plugins: Some(plugins_arr) }
	}

	pub fn validate_config(&self) -> String {
		if self.presets.is_none() {
			return String::from("no_preset")
		} if self.plugins.is_none() {
			return String::from("no_plugin")
		}

		//find the react preset
		let mut react_preset_found = false;
		let presets = self.presets.clone().unwrap();
		for preset in presets.iter() {
			if preset.is_string() == false {
				continue;
			}

			let preset_string = preset.as_str().expect("malformed data");
			if preset_string == "@babel/preset-react" {
				react_preset_found = true;
			}
		}

		//find the jsx transform plugin
		let mut jsx_transform_found = false;
		let plugins = self.plugins.clone().unwrap();
		for (i, plugin) in plugins.iter().enumerate() {
			if plugin.is_array() {
				let mut namespace_found = false;
				let mut valid_options = false;

				let plugin_array = plugin.as_array().unwrap();
				for plugin_element in plugin_array.iter() {
					if plugin_element.is_string() {
						let plugin_string = plugin_element.as_str().unwrap();
						if plugin_string == "@babel/plugin-transform-react-jsx" {
							namespace_found = true;
						}
					} if plugin_element.is_object() {
						if namespace_found == false {
							continue;
						}

						let plugin_object = plugin_element.as_object().unwrap();
						if plugin_object.contains_key("runtime") == false {
							let error_string = format!("missing_runtime-{}", &i);
							return error_string
						}

						let runtime_val = plugin_object.get("runtime").unwrap();
						if runtime_val.is_string() == false {
							let error_string = format!("bad_runtime-{}", &i);
							return error_string
						}

						let runtime_val = runtime_val.as_str().unwrap();
						if runtime_val != "automatic" {
							let error_string = format!("not_auto_runtime-{}", &i);
							return error_string
						}

						valid_options = true;
					}
				}

				if namespace_found == true && valid_options == true {
					jsx_transform_found = true;
				}
			}
		}

		if react_preset_found == false {
			return String::from("no_react_preset")
		} if jsx_transform_found == false {
			return String::from("no_jsx_transform")
		}

		String::from("valid")
	}
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PackageJson {
	pub name: Option<String>,
	pub version: Option<String>,
	pub scripts: Option<Map<String, Value>>,
	pub dependencies: Option<Map<String, Value>>,

	#[serde(rename="devDependencies")]
	pub dev_dependencies: Option<Map<String, Value>>
}

impl PackageJson {
	pub fn validate_package_json(&mut self) -> String {
		if self.scripts.is_none() {
			return "no_scripts".into()
		} if self.dependencies.is_none() {
			let mut dependencies_object: Map<String, Value> = Map::new();
			dependencies_object.insert("parcel".into(), "^2.00".into());
			self.dependencies = Some(dependencies_object);
		}

		//check the scripts
		let scripts_object = self.scripts.clone().unwrap();
		if scripts_object.contains_key("build") == false {
			return "no_build".into()
		}

		let mut dependencies_object = self.dependencies.clone().unwrap();
		if dependencies_object.contains_key("parcel") == false {
			dependencies_object.insert("parcel".into(), "^2.00".into());
		} if dependencies_object.contains_key("posthtml-inline-assets") == false {
			dependencies_object.insert("posthtml-inline-assets".into(), "3.1.0".into());
		} if dependencies_object.contains_key("@parcel/transformer-posthtml") == false {
			dependencies_object.insert("@parcel/transformer-posthtml".into(), "2.8.3".into());
		}

		self.dependencies = Some(dependencies_object);
		"no_build".into()
	}
}

#[derive(Debug, Deserialize, Serialize)]
pub struct CompileProjectResult {
	pub error: bool,

	#[serde(rename="errorMessage")]
	pub error_message: Option<String>,

	#[serde(rename="htmlOutput")]
	pub html_output: Option<String>
}

impl CompileProjectResult {
	pub fn _create_error_message(message: String) -> String {
		let error_message = Self {
			error: true,
			error_message: Some(message),
			html_output: None
		};

		let out_string = serde_json::to_string(&error_message).unwrap();
		return out_string
	}

	pub fn successful_message(html: String) -> String {
		let success_message = Self {
			error: false,
			error_message: None,
			html_output: Some(html)
		};

		let out_str = serde_json::to_string(&success_message).unwrap();
		return out_str
	}
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PostHTMLConfig {
	plugins: Value
}

impl PostHTMLConfig {
	pub fn init_config() -> Self {
		let mut plugins_object: Map<String, Value> = Map::new();
		let inline_object: Map<String, Value> = Map::new();
		plugins_object.insert("posthtml-inline-assets".into(), inline_object.into());

		Self {
			plugins: plugins_object.into()
		}
	}
}