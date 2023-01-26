import { config } from "../config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { ExtensionContext, Uri, workspace } from "vscode";
import states from "./states";

async function saveConfig(e: Uri, stateManager: ReturnType<typeof states>, tag: string) {
  const file = e.fsPath;
  const fileData = readFileSync(file, { encoding: 'utf8' });
  return stateManager.update(`${config.app}_${tag}`, fileData);
}

function watcherFiles(baseUrl: string, context: ExtensionContext) {
  const watcherReact = workspace.createFileSystemWatcher(resolve(baseUrl, 'react.js'));
  const watcherJest = workspace.createFileSystemWatcher(resolve(baseUrl, 'jest.js'));
  const watcherFunc = workspace.createFileSystemWatcher(resolve(baseUrl, 'func.js'));
  const stateManager = states(context);

  watcherReact.onDidCreate((e)=> saveConfig(e, stateManager, 'react'));
  watcherReact.onDidChange((e)=> saveConfig(e, stateManager, 'react'));
  watcherReact.onDidDelete(()=> stateManager.update(`${config.app}_react`, undefined));

  watcherJest.onDidCreate((e)=> saveConfig(e, stateManager, 'jest'));
  watcherJest.onDidChange((e)=> saveConfig(e, stateManager, 'jest'));
  watcherJest.onDidDelete(()=> stateManager.update(`${config.app}_jest`, undefined));

  watcherFunc.onDidCreate((e)=> saveConfig(e, stateManager, 'func'));
  watcherFunc.onDidChange((e)=> saveConfig(e, stateManager, 'func'));
  watcherFunc.onDidDelete(()=> stateManager.update(`${config.app}_func`, undefined));
}

export default watcherFiles;