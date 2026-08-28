import { window } from 'vscode';
import { basename, resolve } from 'path';
import { ICallbackCommand } from '../types';
import { MENU_OPTIONS } from '../constants';
import showMessage from './showMessage';

const KEBAB_CASE_REGEX = /^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/;

/**
 * Resolves the folder name for a "Folder and Files" / "Files only" style command:
 * when the user chose to create a new folder, asks for a name and validates it as
 * kebab-case; otherwise derives the name from the existing target folder.
 * Returns `undefined` when the operation should be aborted (an error was already shown).
 */
async function resolveFolderName(
  props: ICallbackCommand,
  folderAndFilesAction: MENU_OPTIONS,
): Promise<string | undefined> {
  if (props.action !== folderAndFilesAction) {
    return basename(resolve(props.path));
  }

  const enteredFolderName = await window.showInputBox({
    title: 'Enter the folder name',
    placeHolder: 'Ex: name-component',
  });
  const folderName = (enteredFolderName || '').trim().toLowerCase();

  if (!folderName || !KEBAB_CASE_REGEX.test(folderName)) {
    showMessage.error('Invalid format!');
    return undefined;
  }

  return folderName;
}

export default resolveFolderName;
