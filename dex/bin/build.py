import subprocess
import os
import sys
import platform

def get_android_sdk_path():
    """Finds the default Android SDK path based on the Operating System."""
    system = platform.system()
    if system == "Windows":
        return os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~\\AppData\\Local")), "Android", "Sdk")
    elif system == "Darwin": 
        return os.path.expanduser("~/Library/Android/sdk")
    else: 
        return os.path.expanduser("~/Android/Sdk")

def find_latest_d8():
    """Finds the absolute path to the latest installed d8 executable."""
    sdk_path = get_android_sdk_path()
    build_tools_path = os.path.join(sdk_path, "build-tools")
    
    if not os.path.exists(build_tools_path):
        return None
        
    try:
        versions = [d for d in os.listdir(build_tools_path) if os.path.isdir(os.path.join(build_tools_path, d))]
        
        def parse_version(v):
            return [int(p) if p.isdigit() else p for p in v.replace('-', '.').split('.')]
        
        versions.sort(key=parse_version, reverse=True)
        d8_executable = "d8.bat" if platform.system() == "Windows" else "d8"
        
        for version in versions:
            d8_path = os.path.join(build_tools_path, version, d8_executable)
            if os.path.exists(d8_path):
                return d8_path
    except Exception as e:
        print(f"Warning: Failed to search build-tools directory: {e}")
        
    return None

def find_latest_android_jar():
    """Finds the android.jar for the highest installed API level."""
    sdk_path = get_android_sdk_path()
    platforms_path = os.path.join(sdk_path, "platforms")
    
    if not os.path.exists(platforms_path):
        return None
        
    try:
        # Look for folders like "android-34", "android-33"
        platforms = [d for d in os.listdir(platforms_path) if d.startswith("android-") and os.path.isdir(os.path.join(platforms_path, d))]
        
        def get_api_level(folder_name):
            try:
                return int(folder_name.split("-")[1])
            except ValueError:
                return 0
                
        platforms.sort(key=get_api_level, reverse=True)
        
        for platform_dir in platforms:
            jar_path = os.path.join(platforms_path, platform_dir, "android.jar")
            if os.path.exists(jar_path):
                return jar_path
    except Exception as e:
        print(f"Warning: Failed to search platforms directory: {e}")
        
    return None

def kt_to_dex(kt_file_path, output_dir="."):
    if not os.path.exists(kt_file_path):
        print(f"Error: File '{kt_file_path}' not found.")
        sys.exit(1)

    d8_path = find_latest_d8()
    if not d8_path:
        print("Error: Could not automatically locate 'd8' in your Android SDK.")
        sys.exit(1)
        
    android_jar_path = find_latest_android_jar()

    base_name = os.path.splitext(os.path.basename(kt_file_path))[0]
    jar_file = f"{base_name}.jar"

    print(f"Step 1: Compiling {kt_file_path} to {jar_file}...")
    kotlinc_cmd = ["kotlinc", kt_file_path, "-include-runtime", "-d", jar_file]
    
    # If we found android.jar, add it to the classpath so kotlinc knows Android classes
    if android_jar_path:
        print(f"(Using Android Framework: {android_jar_path})")
        kotlinc_cmd.extend(["-classpath", android_jar_path])
    else:
        print("Warning: android.jar not found. Compilation might fail if using Android specific imports.")
    
    use_shell = platform.system() == "Windows"
    
    try:
        subprocess.run(kotlinc_cmd, check=True, capture_output=True, text=True, shell=use_shell)
        print("✓ Kotlin compilation successful.")
    except subprocess.CalledProcessError as e:
        print("✗ Kotlin compilation failed.")
        print(e.stderr)
        sys.exit(1)

    print(f"\nStep 2: Converting {jar_file} to DEX...")
    d8_cmd = [d8_path, jar_file, f"--output={output_dir}"]
    
    try:
        subprocess.run(d8_cmd, check=True, capture_output=True, text=True, shell=use_shell)
        print(f"✓ DEX conversion successful! Output saved in: {os.path.abspath(output_dir)}")
    except subprocess.CalledProcessError as e:
        print("✗ DEX conversion failed.")
        print(e.stderr)
    finally:
        if os.path.exists(jar_file):
            os.remove(jar_file)
            print(f"(Cleaned up temporary file: {jar_file})")

if __name__ == "__main__":
    input_kt_file = "../missingFiles.kt"
    kt_to_dex(input_kt_file)