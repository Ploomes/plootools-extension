import { Uri, workspace } from "vscode";

function createDirectory(path: string) {
  return workspace.fs.createDirectory(Uri.parse(path));
}

export default createDirectory;
