import { Uri, window } from "vscode";
import * as _path from "path";
import * as fs from "fs";
import { config } from "../config";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "../types";
import { buildTemplate, createDirectory, createFile, toPascalCase } from "../utils";
import { REACT } from "../templates";

interface ICreateFilesAndFolder extends Pick<ICallbackCommand, 'path' | 'action'> {
  folderName: string;
}
async function createFilesAndFolder(props: ICreateFilesAndFolder) {
  const {
    path,
    folderName,
    action
  } = props;

  try {
    const getPath = Uri.parse(path).fsPath;
    const folderNamePascalCase = toPascalCase(folderName);
    const isCreateFilesOnly = action === MENU_OPTIONS.REACT_COMPONENT_FILES_ONLY;
    let dir = getPath;
    const pathToCreateFiles = isCreateFilesOnly ? path : `${path}/${folderNamePascalCase}`;
    if(isCreateFilesOnly) {
      dir = _path.resolve(getPath);
    }else {
      dir = _path.resolve(`${getPath}/${folderNamePascalCase}`);
    }

    if(!isCreateFilesOnly) {
      if(fs.existsSync(dir)) {
        return window.showErrorMessage(`${config.displayName}: Folder already exists!`);
      }
      await createDirectory(`${path}/${folderNamePascalCase}`);
    }
    
    let isSuccess = false;
    for(const keyFile in REACT) {
      const key = keyFile as keyof typeof REACT;
      const file = REACT[key];
      const { fileName, template } = buildTemplate({
        folderName,
        template: file.content,
        fileName: file.name
      });

      if(!fs.existsSync(_path.resolve(`${dir}/${fileName}`))) {
        await createFile(
          `${pathToCreateFiles}/${fileName}`,
          template
        );
        isSuccess = true;
      }
    }

    if(isSuccess) {
      return window.showInformationMessage(`${config.displayName}: Successfully created files!`);
    }
  } catch {
    return window.showErrorMessage(`${config.displayName}: The folder and files could not be created!`);
  }
}

async function createComponent(props: ICallbackCommand) {
  if(props.action === MENU_OPTIONS.REACT_COMPONENT_FOLDER_AND_FILES) {
    const folderName = await window.showInputBox({
      title: "Enter the folder name",
      placeHolder: "Ex: name-component",
    });
    const regKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/g;
    if(!folderName) {
      return window.showErrorMessage(`${config.displayName}: invalid format!`);
    }
    if(!regKebabCase.test(folderName)) {
      return window.showErrorMessage(`${config.displayName}: invalid format!`);
    }
    createFilesAndFolder({
      ...props,
      folderName
    });
  }else {
    const folderName = _path.basename(_path.resolve(props.path));
    window.showErrorMessage(folderName);
    createFilesAndFolder({
      ...props,
      folderName
    });
  }
};

export default createComponent;