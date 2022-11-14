import { Uri, window } from "vscode";
import { basename, resolve } from "path";
import { existsSync } from "fs";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "../types";
import { buildTemplate, createDirectory, createFile, showMessage, toPascalCase } from "../utils";
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
      dir = resolve(getPath);
    }else {
      dir = resolve(`${getPath}/${folderNamePascalCase}`);
    }

    if(!isCreateFilesOnly) {
      if(existsSync(dir)) {
        return showMessage.error('Folder already exists!');
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

      if(!existsSync(resolve(`${dir}/${fileName}`))) {
        await createFile(
          `${pathToCreateFiles}/${fileName}`,
          template
        );
        isSuccess = true;
      }
    }

    if(isSuccess) {
      return showMessage.info('Successfully created files!');
    }
  } catch {
    return showMessage.error('The folder and files could not be created!');
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
      return showMessage.error('Invalid format!');
    }
    if(!regKebabCase.test(folderName)) {
      return showMessage.error('Invalid format!');
    }
    createFilesAndFolder({
      ...props,
      folderName
    });
  }else {
    const folderName = basename(resolve(props.path));
    createFilesAndFolder({
      ...props,
      folderName
    }).then(()=>{
      showMessage.info('Files created successfully!');
    });
  }
};

export default createComponent;