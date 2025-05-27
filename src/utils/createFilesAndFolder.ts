import { Uri } from "vscode";
import toPascalCase from "./toPascalCase";
import { ICallbackCommand, TTemplates } from "types";
import { resolve } from "path";
import { existsSync } from "fs";
import showMessage from "./showMessage";
import createDirectory from "./createDirectory";
import { config } from "../config";
import buildTemplate, { IBuildTemplate } from "./buildTemplate";
import createFile from "./createFile";
import camelCase from 'lodash/camelCase';

type TTypeFormatString = "CAMEL" | "PASCAL";

interface ICreateFilesAndFolder extends ICallbackCommand {
  folderName: string;
  isCreateFilesOnly: boolean;
  keyOnWorkspace: string;
  defaultTemplate: TTemplates;
  formats?: {
    folderName?: TTypeFormatString;
    fileName?: TTypeFormatString;
  }
}

async function createFilesAndFolder(props: ICreateFilesAndFolder) {
  const {
    path,
    folderName,
    context,
    isCreateFilesOnly,
    keyOnWorkspace,
    defaultTemplate,
    formats = {
      folderName: 'PASCAL'
    }
  } = props;

  try {
    const getPath = Uri.parse(path).fsPath;
    let formatedFolderName = '';

    switch(formats.folderName) {
      case "CAMEL":
        formatedFolderName = camelCase(folderName);
        break;
      default:
        formatedFolderName = toPascalCase(folderName);
        break;
    }

    let dir = getPath;
    const pathToCreateFiles = isCreateFilesOnly ? path : `${path}/${formatedFolderName}`;
    if(isCreateFilesOnly) {
      dir = resolve(getPath);
    }else {
      dir = resolve(`${getPath}/${formatedFolderName}`);
    }

    if(!isCreateFilesOnly) {
      if(existsSync(dir)) {
        return showMessage.error('Folder already exists!');
      }
      await createDirectory(`${path}/${formatedFolderName}`);
    }

    const currentStateWorkspace = context?.workspaceState.get(`${config.app}_${keyOnWorkspace}`) as string;
    const currentTemplates = currentStateWorkspace ? eval(currentStateWorkspace) : defaultTemplate;
    const promises = [];

    for(const keyFile in currentTemplates) {
      const key = keyFile as keyof typeof currentTemplates;
      const file = currentTemplates[key] as { [K in string]: string };

      const optionsTemplate: IBuildTemplate = {
        folderName,
        template: file.content,
        fileName: file.name
      };

      if(file.prettier) {
        optionsTemplate['prettier'] = file.prettier as IBuildTemplate['prettier'];
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
  } catch (error) {
    return showMessage.error('The folder and files could not be created!');
  }
}


export default createFilesAndFolder;