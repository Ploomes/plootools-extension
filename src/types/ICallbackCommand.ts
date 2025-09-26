import { ExtensionContext } from 'vscode';
import { MENU_OPTIONS } from '../constants';
import IMultiSelectMenu from './IMultiSelectMenu';

interface ICallbackCommand {
  fsPath: string;
  path: string;
  action?: MENU_OPTIONS;
  fileName?: string;
  extensionName?: string;
  context?: ExtensionContext;
  selectedMultiOptions?: IMultiSelectMenu[];
}

export default ICallbackCommand;
