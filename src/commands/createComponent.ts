import { Uri, window } from "vscode";
import { basename, resolve } from "path";
import { existsSync } from "fs";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "../types";
import { buildTemplate, createDirectory, createFile, showMessage, toPascalCase } from "../utils";
import { REACT } from "../templates";
import { config } from "../config";

interface ICreateFilesAndFolder extends ICallbackCommand {
  folderName: string;
}
async function createFilesAndFolder(props: ICreateFilesAndFolder) {
  const {
    path,
    folderName,
    action,
    context
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
    
    const stateReact = context?.workspaceState.get(`${config.app}_react`) as string;
    const reactTemplates = stateReact ? eval(stateReact) : REACT;
    const promises = [];

    for(const keyFile in reactTemplates) {
      const key = keyFile as keyof typeof reactTemplates;
      const file = reactTemplates[key] as { [K in string]: string };

      const optionsTemplate = {
        folderName,
        template: file.content,
        fileName: file.name
      };

      if(file.prettier) {
        // @ts-ignore
        optionsTemplate['prettier'] = file.prettier;
      }

      const { fileName, template } = buildTemplate(optionsTemplate);
      if(!existsSync(resolve(`${dir}/${fileName}`))) {
        const create = createFile(
          `${pathToCreateFiles}/${fileName}`,
          template
        );
        promises.push(create);
      }
    }

    return await Promise.all(promises).then(()=>{
      return showMessage.info('Successfully created files!');
    })
    .catch(()=> {
      throw new Error();
    });
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
    if(!folderName || !regKebabCase.test(folderName)) {
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
    }).then(()=> showMessage.info('Files created successfully!'));
  }
};

export default createComponent;