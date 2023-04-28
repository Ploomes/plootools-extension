import { ExtensionContext } from "vscode";
import { MENU_OPTIONS } from "../constants";

interface ICallbackCommand {
  fsPath: string;
  path: string;
  action?: MENU_OPTIONS;
  fileName?: string;
  extensionName?: string;
  context?: ExtensionContext
}

export default ICallbackCommand;
