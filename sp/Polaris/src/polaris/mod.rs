#![allow(
    dead_code,
    unused_variables,
    clippy::too_many_arguments,
    clippy::unnecessary_wraps
)]

mod vk_instance;

use anyhow::Result;
use winit::dpi::LogicalSize;
use winit::event::{Event, WindowEvent};
use winit::event_loop::{ControlFlow, EventLoop};
use winit::window::{Window, WindowBuilder};

//vulkan imports
use anyhow::{anyhow, Result};
use vulkanalia::loader::{LibloadingLoader, LIBRARY};
use vulkanalia::window as vk_window;
use vulkanalia::prelude::v1_0::*;

#[derive(Clone, Debug)]
pub struct Polaris {
    entry: Option<Entry>,
    instance: Option<Instance>
}

#[derive(Clone, Debug, Default)]
struct AppData {}

impl Polaris {
    pub fn init_engine() -> Polaris {
        Polaris { entry: None, instance: None }
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
        let loader = LibloadingLoader::new(LIBRARY)?;
        let entry  = Entry::new(loader).map_err(|b| anyhow!("{}", b))?;

        self.entry = Some(entry);
        Ok(())
    }

    unsafe fn render(&mut self, window: &Window) -> Result<()> {
        Ok(())
    }

    unsafe fn destroy(&mut self) {}
}