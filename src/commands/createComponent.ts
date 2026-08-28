import { MENU_OPTIONS } from '../constants';
import { ICallbackCommand } from '../types';
import { createFilesAndFolder, resolveFolderName, showMessage } from '../utils';
import { REACT } from '../templates';

async function createComponent(props: ICallbackCommand) {
  const isCreateFilesOnly = props.action === MENU_OPTIONS.REACT_COMPONENT_FILES_ONLY;

  const folderName = await resolveFolderName(props, MENU_OPTIONS.REACT_COMPONENT_FOLDER_AND_FILES);
  if (!folderName) {
    return;
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
