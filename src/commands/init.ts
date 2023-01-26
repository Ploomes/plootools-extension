import { ExtensionContext, workspace } from "vscode";
import { createFileCustomTemplates, showMessage, watcherFiles } from '../utils';
import { config } from "../config";
import { resolve } from "path";
import { existsSync } from "fs";

function init(this:ExtensionContext) {
  if(workspace.workspaceFolders) {
    const { workspaceFolders } = workspace;
    const folderName = resolve( workspaceFolders[0].uri.fsPath, config.folderNameSettings);
    if(existsSync(folderName)) {
      return showMessage.error('Configuration folder already exists!');
    }else {
      createFileCustomTemplates(folderName)
      .then(()=> watcherFiles(folderName, this));
    }
  }else {
    showMessage.error('Unable to create configuration folder');
  }
};

export default init;
