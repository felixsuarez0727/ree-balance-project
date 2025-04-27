import os

ignore_folders = {"env", "node_modules", ".git", "mongo-data", "readme-imgs", "processor"}

script_name = "structure.py"

config_extensions = {".json", ".yaml", ".yml", ".env"}

special_files = {"docker-compose.yml"}

def get_icon(file_name):
    if file_name in special_files:
        return "🚀"
    _, ext = os.path.splitext(file_name)
    if ext in config_extensions or file_name.startswith("."):
        return "⚙️"
    return "📄"

def print_structure(base_path, prefix=""):
    items = sorted(os.listdir(base_path))
    items = [item for item in items if item != script_name and item not in ignore_folders]
    
    for index, item in enumerate(items):
        path = os.path.join(base_path, item)
        connector = "└── " if index == len(items) - 1 else "├── "
        
        if os.path.isdir(path):
            print(f"{prefix}{connector}📂 {item}")
            new_prefix = prefix + ("    " if index == len(items) - 1 else "│   ")
            print_structure(path, new_prefix)
        else:
            icon = get_icon(item)
            print(f"{prefix}{connector}{icon} {item}")

if __name__ == "__main__":
    base_directory = os.getcwd() 
    print("\nProject structure:\n")
    print(f"📁 {os.path.basename(base_directory)}")
    print_structure(base_directory)
