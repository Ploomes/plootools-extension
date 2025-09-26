import { QuickPickItem } from 'vscode';
import MENU_OPTIONS from './MENU_OPTIONS';

const MENU_OPTIONS_DISPLAY: (QuickPickItem & { id: MENU_OPTIONS })[] = [
  {
    label: '$(files) Create React Component',
    id: MENU_OPTIONS.CREATE_COMPONENT,
  },
  {
    label: '$(tools) Create tests',
    id: MENU_OPTIONS.CREATE_TESTS,
  },
  {
    label: '$(code) Create function and test',
    id: MENU_OPTIONS.CREATE_FUNC_TEST,
  },
  {
    label: '$(circuit-board) Create state manager (Jotai)',
    id: MENU_OPTIONS.CREATE_JOTAI_STATE,
  },
  {
    label: '$(circuit-board) Create state manager (Recoil)',
    id: MENU_OPTIONS.CREATE_RECOIL_STATE,
  },
  {
    label: '$(terminal-new) Insert new icons',
    id: MENU_OPTIONS.INSERT_ICONS,
  },
];

export default MENU_OPTIONS_DISPLAY;
