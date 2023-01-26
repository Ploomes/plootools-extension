// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { existsSync } from 'fs';
import { resolve } from 'path';
import { watcherFiles } from './utils';
import { commands, ExtensionContext, workspace } from 'vscode';
import { createMenu, init } from './commands';
import { config } from './config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
	context.subscriptions.push(commands.registerCommand(`${config.app}.menu`, createMenu, context));
	context.subscriptions.push(commands.registerCommand(`${config.app}.init`, init, context));

	if(workspace.workspaceFolders) {
    const { workspaceFolders } = workspace;
    const baseUrl = resolve( workspaceFolders[0].uri.fsPath, config.folderNameSettings);
    if(existsSync(baseUrl)) watcherFiles(baseUrl, context);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
