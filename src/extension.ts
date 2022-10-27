// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, ExtensionContext } from 'vscode';
import { createMenu } from './commands';
import { config } from './config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand(`${config.app}.menu`, createMenu));
}

// this method is called when your extension is deactivated
export function deactivate() {}
