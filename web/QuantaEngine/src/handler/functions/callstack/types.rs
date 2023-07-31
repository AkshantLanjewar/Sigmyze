use serde_json::Value;
use crate::handler::functions::{InternalStore, QuantaFieldType};
use serde::{Serialize, Deserialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ExecuteStackWrapperBody {
	#[serde(rename="preloadedData")]
	pub preloaded_data: Option<String>,

	#[serde(rename="stack")]
	pub call_stack: Option<Vec<StackFunction>>,

	#[serde(rename="organizationId")]
	pub organization_id: Option<String>,

	pub edges: Option<Vec<QuantaEdge>>,

	pub schema: Option<QuantaSchema>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaSchema {
	pub name: Option<String>,

	#[serde(rename="type")]
	pub type_ref: Option<String>,

	#[serde(rename="quantaType")]
	pub quanta_type: Option<QuantaFieldType>,

	#[serde(rename="nodeId")]
	pub node_id: Option<String>,

	pub children: Option<Vec<QuantaSchema>>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct QuantaEdge {
	pub id: Option<String>,

	pub source: Option<String>,

	#[serde(rename="sourceHandle")]
	pub source_handle: Option<String>,

	pub target: Option<String>,

	#[serde(rename="targetHandle")]
	pub target_handle: Option<String>
}

impl QuantaEdge {
	pub fn validate(&self) -> bool {
		if self.source.is_none() || self.source_handle.is_none() {
			return false;
		} if self.target.is_none() || self.target_handle.is_none() {
			return false;
		}

		true
	}
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct InternalStorePreload {
	pub store: Option<InternalStore>,

	pub value: Option<String>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct StackFunction {
	#[serde(rename="nodeId")]
	pub node_id: Option<String>,

	#[serde(rename="functionId")]
	pub function_id: Option<String>,

	pub inputs: Option<Vec<StackParam>>,

	#[serde(rename="dynamicOutputs")]
	pub dynamic_outputs: Option<Vec<StackParam>>,

	pub dependencies: Option<Vec<String>>,

	#[serde(rename="parentId")]
	pub parent_id: Option<String>,

	#[serde(rename="stackThread")]
	pub stack_thread: Option<Vec<StackFunction>>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct StackParam {
	pub id: Option<String>,

	#[serde(rename="type")]
	pub type_ref: Option<QuantaFieldType>,

	pub name: Option<String>,

	#[serde(rename="staticSocket")]
	pub static_socket: Option<bool>
}