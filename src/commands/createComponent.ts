import { window } from 'vscode';
import { basename, resolve } from 'path';
import { MENU_OPTIONS } from '../constants';
import { ICallbackCommand } from '../types';
import { createFilesAndFolder, showMessage } from '../utils';
import { REACT } from '../templates';

async function createComponent(props: ICallbackCommand) {
  const isCreateFilesOnly = props.action === MENU_OPTIONS.REACT_COMPONENT_FILES_ONLY;
  let folderName: string;

  if (props.action === MENU_OPTIONS.REACT_COMPONENT_FOLDER_AND_FILES) {
    const enteredFolderName = await window.showInputBox({
      title: 'Enter the folder name',
      placeHolder: 'Ex: name-component',
    });
    folderName = (enteredFolderName || '').trim().toLowerCase();

    const regKebabCase = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/g;
    if (!folderName || !regKebabCase.test(folderName)) {
      return showMessage.error('Invalid format!');
    }
  } else {
    folderName = basename(resolve(props.path));
  }
  createFilesAndFolder({
    ...props,
    folderName,
    defaultTemplate: REACT,
    isCreateFilesOnly,
    keyOnWorkspace: 'react',
  }).then(() => {
    if (isCreateFilesOnly) {
      showMessage.info('Files created successfully!');
    }
  });
}

export default createComponent;
