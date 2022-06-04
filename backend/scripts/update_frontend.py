import os, shutil, yaml, json

new_frontend_path = "/home/mmo/Desktop/testDapp/test_dapp/brownie_build"
new_config_path = "/home/mmo/Desktop/testDapp/frontend/brownie-config.json"
def update_frontend():
    # Send the build folder
    copy_folders("./build", new_frontend_path)

    # Send the front end the config in JSON
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open(new_config_path, "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)

if __name__ == "__main__":
    update_frontend()
    