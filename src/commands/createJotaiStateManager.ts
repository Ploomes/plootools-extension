import { MENU_OPTIONS } from '../constants';
import { ICallbackCommand } from '@/types';
import { createFilesAndFolder, resolveFolderName, showMessage } from '../utils';
import { JOTAI_STATE } from '../templates';

async function createJotaiStateManager(props: ICallbackCommand) {
  const { selectedMultiOptions = [] } = props;
  const isCreateFilesOnly = props.action === MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES_ONLY;

  const useReset = Boolean(
    selectedMultiOptions.find(({ id }) => id === MENU_OPTIONS.JOTAI_STATE_WITH_RESET),
  );
  const useAtomFamily = Boolean(
    selectedMultiOptions.find(({ id }) => id === MENU_OPTIONS.JOTAI_STATE_WITH_ATOM_FAMILY),
  );

  const folderName = await resolveFolderName(props, MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES);
  if (!folderName) {
    return;
  }

  return createFilesAndFolder({
    ...props,
    folderName,
    defaultTemplate: JOTAI_STATE,
    isCreateFilesOnly,
    keyOnWorkspace: 'jotai',
    contentContext: { useAtomFamily, useReset },
    formats: {
      folderName: 'CAMEL',
    },
  }).then(() => {
    if (isCreateFilesOnly) {
      showMessage.info('Files created successfully!');
    }
  });
}

export default createJotaiStateManager;
