import { MENU_OPTIONS } from '../constants';
import { QuickPickItem } from 'vscode';

interface IMultiSelectMenu extends QuickPickItem {
  id: number | string | MENU_OPTIONS;
}

export default IMultiSelectMenu;
