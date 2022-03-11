#![allow(
    dead_code,
    unused_variables,
    clippy::too_many_arguments,
    clippy::unnecessary_wraps
)]

use super::app_data;
use super::queue_family;

use anyhow::{anyhow, Result};
use winit::window::{Window};

//vulkan imports
use vulkanalia::window as vk_window;
use vulkanalia::prelude::v1_0::*;
use vulkanalia::vk::ExtDebugUtilsExtension;

use std::collections::HashSet;
use std::ffi::CStr;
use std::os::raw::c_void;

use log::*;

extern "system" fn debug_callback(
    severity: vk::DebugUtilsMessageSeverityFlagsEXT,
    type_: vk::DebugUtilsMessageTypeFlagsEXT,
    data: *const vk::DebugUtilsMessengerCallbackDataEXT,
    _: *mut c_void,
) -> vk::Bool32 {
    let data = unsafe { *data };
    let message = unsafe { CStr::from_ptr(data.message) }.to_string_lossy();

    if severity >= vk::DebugUtilsMessageSeverityFlagsEXT::ERROR {
        error!("({:?}) {}", type_, message);
    } else if severity >= vk::DebugUtilsMessageSeverityFlagsEXT::WARNING {
        warn!("({:?}) {}", type_, message);
    } else if severity >= vk::DebugUtilsMessageSeverityFlagsEXT::INFO {
        debug!("({:?}) {}", type_, message);
    } else {
        trace!("({:?}) {}", type_, message);
    }

    vk::FALSE
}

pub unsafe fn create_instance(window: &Window, entry: &Entry, validation_enabled: bool, data: &mut app_data::AppData) -> Result<Instance> {
    const VALIDATION_LAYER: vk::ExtensionName = vk::ExtensionName::from_bytes(b"VK_LAYER_KHRONOS_validation");
    let application_info = vk::ApplicationInfo::builder()
        .application_name(b"Polaris")
        .application_version(vk::make_version(1, 0, 0))
        .engine_name(b"No Engine\0")
        .engine_version(vk::make_version(1, 0, 0))
        .api_version(vk::make_version(1, 0, 0));

    let available_layers = entry
        .enumerate_instance_layer_properties()?
        .iter()
        .map(|l| l.layer_name)
        .collect::<HashSet<_>>();

    if validation_enabled && !available_layers.contains(&VALIDATION_LAYER) {
        return Err(anyhow!("Validation layer requested but not supported"));
    }

    let layers = if validation_enabled {
        vec![VALIDATION_LAYER.as_ptr()]
    } else {
        Vec::new()
    };

    //extensions
    let mut extensions = vk_window::get_required_instance_extensions(window)
        .iter()
        .map(|e| e.as_ptr())
        .collect::<Vec<_>>();
    if validation_enabled {
        extensions.push(vk::EXT_DEBUG_UTILS_EXTENSION.name.as_ptr());
    }

    //create
    let mut info = vk::InstanceCreateInfo::builder()
        .application_info(&application_info)
        .enabled_layer_names(&layers)
        .enabled_extension_names(&extensions);
    
    let mut debug_info = vk::DebugUtilsMessengerCreateInfoEXT::builder()
        .message_severity(vk::DebugUtilsMessageSeverityFlagsEXT::all())
        .message_type(vk::DebugUtilsMessageTypeFlagsEXT::all())
        .user_callback(Some(debug_callback));

    if validation_enabled {
        info = info.push_next(&mut debug_info);
    }
    
    let instance = entry.create_instance(&info, None)?;
    if validation_enabled {
        let debug_info = vk::DebugUtilsMessengerCreateInfoEXT::builder()
            .message_severity(vk::DebugUtilsMessageSeverityFlagsEXT::all())
            .message_type(vk::DebugUtilsMessageTypeFlagsEXT::all())
            .user_callback(Some(debug_callback));
        
        data.messenger = instance.create_debug_utils_messenger_ext(
            &debug_info,
            None
        )?;
    }

    Ok(instance)
}

//physical device
unsafe fn check_physical_device(
    instance: &Instance,
    data: &app_data::AppData,
    physical_device: vk::PhysicalDevice
) -> Result<bool> {
    queue_family::QueueFamilyIndices::get(instance, data, physical_device)?;
    Ok(true)
}

pub unsafe fn pick_physical_device(instance: &Instance, data: &mut app_data::AppData) -> Result<()> {
    for physical_device in instance.enumerate_physical_devices()? {
        let properties = instance.get_physical_device_properties(physical_device);

        if let Err(error) = check_physical_device(instance, data, physical_device) {
            warn!("Skipping physical device (`{}`): {}", properties.device_name, error);
        } else {
            println!("[PolarisDEBUG] : Selected physical device (`{}`).", properties.device_name);
            data.physical_device = physical_device;
            return Ok(())
        }
    }
    
    Err(anyhow!("Failed to find suitable physical device"))
} 

//logical device
pub unsafe fn create_logical_device(instance: &Instance, data: &mut app_data::AppData, validation_enabled: bool) -> Result<Device> {
    const VALIDATION_LAYER: vk::ExtensionName = vk::ExtensionName::from_bytes(b"VK_LAYER_KHRONOS_validation");
    let indices = queue_family::QueueFamilyIndices::get(instance, data, data.physical_device)?;

    let mut unique_indices = HashSet::new();
    unique_indices.insert(indices.graphics);
    unique_indices.insert(indices.present);

    let queue_priorities = &[1.0];
    let queue_infos = unique_indices
        .iter()
        .map(|i| {
            vk::DeviceQueueCreateInfo::builder()
                .queue_family_index(*i)
                .queue_priorities(queue_priorities)

        })
        .collect::<Vec<_>>();
    
    let layers = if validation_enabled {
        vec![VALIDATION_LAYER.as_ptr()]
    } else {
        vec![]
    };

    let features = vk::PhysicalDeviceFeatures::builder();

    let info = vk::DeviceCreateInfo::builder()
        .queue_create_infos(&queue_infos)
        .enabled_layer_names(&layers)
        .enabled_features(&features);
    
    let device = instance.create_device(data.physical_device, &info, None)?;
    data.graphics_queue = device.get_device_queue(indices.graphics, 0);
    data.present_queue = device.get_device_queue(indices.present, 0);

    Ok(device)
}