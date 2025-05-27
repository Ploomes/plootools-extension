import { window } from "vscode";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "types";
import { createFilesAndFolder, showMessage } from "../utils";
import { RECOIL_STATE } from "../templates";
import { basename, resolve } from "path";


async function createRecoilStateManager(props: ICallbackCommand) {
  const isCreateFilesOnly = props.action === MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES_ONLY;
  let folderName: string;

  if(props.action === MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES) {
    folderName = await window.showInputBox({
      title: "Enter the folder name",
      placeHolder: "Ex: name-component",
    }) as string;
    const regKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/g;
    if(!folderName || !regKebabCase.test(folderName)) {
      return showMessage.error('Invalid format!');
    }
  }else {
    folderName = basename(resolve(props.path));
  }
  return createFilesAndFolder({
    ...props,
    folderName,
    defaultTemplate: RECOIL_STATE,
    isCreateFilesOnly,
    keyOnWorkspace: 'recoil',
    formats: {
      folderName: 'CAMEL'
    }
  }).then(()=> {
    if(isCreateFilesOnly) showMessage.info('Files created successfully!')
  });
};

export default createRecoilStateManager;