import { window } from "vscode";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "types";
import { createFilesAndFolder, showMessage } from "../utils";
import { JOTAI_STATE } from "../templates";
import { basename, resolve } from "path";
import { cloneDeep } from "lodash";

async function createJotaiStateManager(props: ICallbackCommand) {
  const { selectedMultiOptions = [] } = props;
  const isCreateFilesOnly = props.action === MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES_ONLY;
  let folderName: string;

  const useReset = Boolean(selectedMultiOptions.find(({ id })=> id === MENU_OPTIONS.JOTAI_STATE_WITH_RESET));
  const useAtomFamily = Boolean(selectedMultiOptions.find(({ id })=> id === MENU_OPTIONS.JOTAI_STATE_WITH_ATOM_FAMILY));

  if (props.action === MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES) {
    folderName = await window.showInputBox({
      title: "Enter the folder name",
      placeHolder: "Ex: name-component",
    }) as string;
    const regKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/g;
    if(!folderName || !regKebabCase.test(folderName)) {
      return showMessage.error('Invalid format!');
    }
  } else {
    folderName = basename(resolve(props.path));
  }

  const COPY_JOTAI_STATE = cloneDeep(JOTAI_STATE);

  for (const key in COPY_JOTAI_STATE) {
    const newKey = key as keyof typeof COPY_JOTAI_STATE;
    const value = COPY_JOTAI_STATE[newKey];

    if(typeof value.content === 'function') {
      COPY_JOTAI_STATE[newKey].content = value.content({ useAtomFamily, useReset });
    }
  }
  
  return createFilesAndFolder({
    ...props,
    folderName,
    defaultTemplate: COPY_JOTAI_STATE,
    isCreateFilesOnly,
    keyOnWorkspace: 'jotai',
    formats: {
      folderName: 'CAMEL'
    }
  }).then(()=> {
    if(isCreateFilesOnly) showMessage.info('Files created successfully!')
  });
};

export default createJotaiStateManager;