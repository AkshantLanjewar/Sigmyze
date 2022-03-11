mod polaris;

fn main() {
    let mut engine = polaris::Polaris::init_engine();
    unsafe { engine.run().unwrap() };

    println!("Hello, world!");
}
