import { MENU_OPTIONS } from '../constants';
import { ICallbackCommand } from '@/types';
import { createFilesAndFolder, resolveFolderName, showMessage } from '../utils';
import { RECOIL_STATE } from '../templates';

async function createRecoilStateManager(props: ICallbackCommand) {
  const isCreateFilesOnly = props.action === MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES_ONLY;

  const folderName = await resolveFolderName(props, MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES);
  if (!folderName) {
    return;
  }

  return createFilesAndFolder({
    ...props,
    folderName,
    defaultTemplate: RECOIL_STATE,
    isCreateFilesOnly,
    keyOnWorkspace: 'recoil',
    formats: {
      folderName: 'CAMEL',
    },
  }).then(() => {
    if (isCreateFilesOnly) {
      showMessage.info('Files created successfully!');
    }
  });
}

export default createRecoilStateManager;
