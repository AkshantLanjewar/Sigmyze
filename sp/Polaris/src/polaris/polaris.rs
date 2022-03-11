#![allow(
    dead_code,
    unused_variables,
    clippy::too_many_arguments,
    clippy::unnecessary_wraps,
    unreachable_code,
    unused_mut,
)]

use super::vk;

use winit::dpi::LogicalSize;
use winit::event::{Event, WindowEvent};
use winit::event_loop::{ControlFlow, EventLoop};
use winit::window::{Window, WindowBuilder};

//vulkan imports
use anyhow::{anyhow, Result};
use vulkanalia::loader::{LibloadingLoader, LIBRARY};
use vulkanalia::prelude::v1_0::*;
use vulkanalia::vk::ExtDebugUtilsExtension;
use vulkanalia::vk::KhrSurfaceExtension;
use vulkanalia::window as vk_window;

#[derive(Clone, Debug)]
pub struct Polaris {
    //vulkan objects
    entry: Option<Entry>,
    instance: Option<Instance>,
    device: Option<Device>,

    data: vk::app_data::AppData,
    validation_enabled: bool,
}

impl Polaris {
    pub fn init_engine() -> Polaris {
        let mut data = vk::app_data::AppData::default();
        const VALIDATION_ENABLED: bool = cfg!(debug_assertions);

        Polaris { 
            entry: None, 
            instance: None, 
            device: None,
            data: data,
            validation_enabled: VALIDATION_ENABLED
        }
    }

    pub unsafe fn run(mut self) -> Result<()> {
        pretty_env_logger::init();
        
        let event_loop = EventLoop::new();
        let window     = WindowBuilder::new()
            .with_title("Polaris")
            .with_inner_size(LogicalSize::new(1280, 720))
            .build(&event_loop)?;

        self.init_vk(&window)?;
        let mut destroying = false;
        event_loop.run(move |event, _, control_flow| {
            *control_flow = ControlFlow::Poll;

            match event {
                Event::MainEventsCleared if !destroying =>
                    self.render(&window).unwrap(),
                
                Event::WindowEvent { event: WindowEvent::CloseRequested, .. } => {
                    destroying = true;
                    *control_flow = ControlFlow::Exit;
                    unsafe { self.destroy() };
                }
                
                _ => {}
            }
        });

        Ok(())
    }

    unsafe fn init_vk(&mut self, window: &Window) -> Result<()> {
        let loader   = LibloadingLoader::new(LIBRARY)?;
        let entry    = Entry::new(loader).map_err(|b| anyhow!("{}", b))?;
        let instance = vk::vk_device::create_instance(window, &entry, self.validation_enabled, &mut self.data)?;
        self.data.surface = vk_window::create_surface(&instance, window)?;
        vk::vk_device::pick_physical_device(&instance, &mut self.data)?;
        let device   = vk::vk_device::create_logical_device(&instance, &mut self.data, self.validation_enabled)?;

        self.entry    = Some(entry);
        self.instance = Some(instance);
        self.device   = Some(device);
        Ok(())
    }

    unsafe fn render(&mut self, window: &Window) -> Result<()> {
        Ok(())
    }

    unsafe fn destroy(&mut self) {
        self.device.as_ref().unwrap().destroy_device(None);
        println!("[PolarisDEBUG] : Destroyed Logical Device");
        
        if self.validation_enabled {
            self.instance.as_ref().unwrap().destroy_debug_utils_messenger_ext(
                self.data.messenger,
                None
            );

            println!("[PolarisDEBUG] : Destroyed Debug Messenger");
        }

        self.instance.as_ref().unwrap().destroy_surface_khr(self.data.surface, None);
        println!("[PolarisDEBUG] : Destroyed Window Surface");
        self.instance.as_ref().unwrap().destroy_instance(None);
        println!("[PolarisDEBUG] : Destroyed Instance");
    }
}