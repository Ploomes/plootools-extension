import { MENU_OPTIONS } from "../constants";

export default interface ICallbackCommand {
  fsPath: string;
  path: string;
  action?: MENU_OPTIONS
}