import { config } from '../config';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ExtensionContext, Uri, workspace } from 'vscode';
import states from './states';

type TStateManager = ReturnType<typeof states>;

async function saveConfig(e: Uri, stateManager: TStateManager, tag: string) {
  const file = e.fsPath;
  const fileData = readFileSync(file, { encoding: 'utf8' });
  return stateManager.update(`${config.app}_${tag}`, fileData);
}

interface ICreateWatcherProps {
  baseUrl: string;
  key: string;
  stateManager: TStateManager;
}
function createWatcher({ baseUrl, key, stateManager }: ICreateWatcherProps) {
  const watcher = workspace.createFileSystemWatcher(resolve(baseUrl, `${key}.js`));

  watcher.onDidCreate((e) => saveConfig(e, stateManager, key));
  watcher.onDidChange((e) => saveConfig(e, stateManager, key));
  watcher.onDidDelete(() => stateManager.update(`${config.app}_${key}`, undefined));
}

function watcherFiles(baseUrl: string, context: ExtensionContext) {
  const stateManager = states(context);
  const watcherKeys = ['react', 'jest', 'func', 'jotai', 'recoil'];

  for (const key of watcherKeys) {
    createWatcher({
      baseUrl,
      key,
      stateManager,
    });
  }
}

export default watcherFiles;
