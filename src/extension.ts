// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext } from 'vscode';
import { generateCommands } from './config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	const listCommands = generateCommands();
	listCommands.forEach((command)=> context.subscriptions.push(command));
}

// this method is called when your extension is deactivated
export function deactivate() {}
