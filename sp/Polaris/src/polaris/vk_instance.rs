use anyhow::Result;
use winit::window::{Window};

//vulkan imports
use vulkanalia::window as vk_window;
use vulkanalia::prelude::v1_0::*;

pub fn create_instance(window: &Window, entry: &Entry) -> Result<Instance> {
    let application_info = vk::ApplicationInfo::builder()
        .application_name(b"Polaris")
        .application_version(vk::make_version(1, 0, 0))
        .engine_name(b"No Engine\0")
        .engine_version(vk::make_version(1, 0, 0))
        .api_version(vk::make_version(1, 0, 0));

    //extensions
    let extensions = vk_window::get_required_instance_extensions(window)
        .iter()
        .map(|e| e.as_ptr())
        .collect::<Vec<_>>();

    //create
    let info = vk::InstanceCreateInfo::builder()
        .application_version(&application_info)
        .enabled_extension_names(&extensions);

    Ok((entry.create_instance(&info, None)?))
}