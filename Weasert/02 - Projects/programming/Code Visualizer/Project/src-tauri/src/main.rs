// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://v1.tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn run_code(code: &str) -> Result<String, String> {
    // Placeholder implementation: echo the code back.
    // In a full implementation, this would compile/run the code,
    // capture execution trace, and return it (or an error message).
    Ok(format!("Executed code (mock): {}", code))
}

#[tauri::command]
fn detect_runtime() -> Result<String, String> {
    use std::process::Command;
    let mut runtime_status: serde_json::Value = serde_json::json!({
        "rust": false,
        "go": false,
        "zig": false,
        "python": false
    });

    // Check rustc
    if Command::new("rustc").arg("--version").output().is_ok() {
        runtime_status["rust"] = serde_json::json!(true);
    }

    // Check go
    if Command::new("go").arg("version").output().is_ok() {
        runtime_status["go"] = serde_json::json!(true);
    }

    // Check zig
    if Command::new("zig").arg("version").output().is_ok() {
        runtime_status["zig"] = serde_json::json!(true);
    }

    // Check python
    if Command::new("python").arg("--version").output().is_ok() {
        runtime_status["python"] = serde_json::json!(true);
    }

    Ok(serde_json::to_string(&runtime_status).unwrap_or_default())
}

#[tauri::command]
fn install_runtime(language: &str) -> Result<String, String> {
    // Install missing runtime based on language
    match language.to_lowercase().as_str() {
        "rust" => {
            // Try to install rust via rustup
            let status = Command::new("sh")
                .arg("-c")
                .arg("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh")
                .output();
            match status {
                Ok(_) => Ok("Rust installation script executed".to_string()),
                Err(e) => Err(format!("Failed to install Rust: {}", e)),
            }
        }
        "go" => {
            // Try to install go via apt (Linux) or chocolatey (Windows)
            #[cfg(target_os = "windows")]
            {
                let status = Command::new("powershell")
                    .args(["-Command", "Invoke-WebRequest -Uri 'https://go.dev/dl/go1.22.0.windows-amd64.msi' -OutFile 'go.msi'; Start-Process msiexec -ArgumentList '/i', 'go.msi', '/quiet' -NoNewWindow"])
                    .output();
                match status {
                    Ok(_) => Ok("Go installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Go: {}", e)),
                }
            }
            #[cfg(not(target_os = "windows"))]
            {
                let status = Command::new("apt-get").arg("install").arg("golang").output();
                match status {
                    Ok(_) => Ok("Go installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Go: {}", e)),
                }
            }
        }
        "zig" => {
            // Try to install zig via apt (Linux) or chocolatey (Windows)
            #[cfg(target_os = "windows")]
            {
                let status = Command::new("powershell")
                    .args(["-Command", "Invoke-WebRequest -Uri 'https://ziglang.org/download/0.11.0/zig-windows-x86_64-0.11.0.zip' -OutFile 'zig.zip'; Expand-Archive -Path 'zig.zip' -DestinationPath '.'; Remove-Item 'zig.zip'"])
                    .output();
                match status {
                    Ok(_) => Ok("Zig installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Zig: {}", e)),
                }
            }
            #[cfg(not(target_os = "windows"))]
            {
                let status = Command::new("apt-get").arg("install").arg("zig").output();
                match status {
                    Ok(_) => Ok("Zig installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Zig: {}", e)),
                }
            }
        }
        "python" => {
            // Try to install python via apt (Linux) or chocolatey (Windows)
            #[cfg(target_os = "windows")]
            {
                let status = Command::new("powershell")
                    .args(["-Command", "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe' -OutFile 'python.exe'; Start-Process python.exe -ArgumentList '/quiet', 'InstallPython=1', 'PrependPath=1' -NoNewWindow"])
                    .output();
                match status {
                    Ok(_) => Ok("Python installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Python: {}", e)),
                }
            }
            #[cfg(not(target_os = "windows"))]
            {
                let status = Command::new("apt-get").arg("install").arg("python3").output();
                match status {
                    Ok(_) => Ok("Python installation script executed".to_string()),
                    Err(e) => Err(format!("Failed to install Python: {}", e)),
                }
            }
        }
        _ => Err(format!("Unsupported language: {}", language)),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, run_code, detect_runtime, generate_visualization, install_runtime])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}