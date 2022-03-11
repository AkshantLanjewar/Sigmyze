#![allow(
    unused_mut
)]

mod polaris;

fn main() {
    let mut engine = polaris::polaris::Polaris::init_engine();
    unsafe { engine.run().unwrap() };

    println!("Hello, world!");
}
