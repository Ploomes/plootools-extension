import { commands } from "vscode";
import { createComponent, createMenu, createTests } from "../commands";
import config from "./config";

function generateCommands() {
  return [
		{
			command: 'createTests',
			callback: createTests
		},
		{
			command: 'createComponent',
			callback: createComponent
		},
		{
			command: 'menu',
			callback: createMenu
		}
	].map((item)=> commands.registerCommand(`${config.app}.${item.command}`, item.callback));
}

export default generateCommands;
