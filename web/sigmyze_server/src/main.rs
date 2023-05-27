use std::env;
use std::path::Path;
use std::process::Command;

fn main() {
    println!("Hello, world!");

    let npm = Path::new("../ui-next");
    env::set_current_dir(&npm);
    let output = Command::new("npm.cmd")
        .arg("install")
        .output()
        .expect("failed to execute npm install");

    println!("Status: {}", output.status);
    println!("stdout: {}", String::from_utf8_lossy(&output.stdout));
    println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
}
