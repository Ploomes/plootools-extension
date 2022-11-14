import { MENU_OPTIONS } from "../constants";

interface ICallbackCommand {
  fsPath: string;
  path: string;
  action?: MENU_OPTIONS;
  fileName?: string;
  extensionName?: string | number;
}

export default ICallbackCommand;
