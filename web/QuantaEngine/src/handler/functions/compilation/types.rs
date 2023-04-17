use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

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

