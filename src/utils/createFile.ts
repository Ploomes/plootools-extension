import { Uri, workspace } from "vscode";

async function createFile(path: string, template: string) {
  return workspace.fs.writeFile(Uri.parse(path), Buffer.from(template, "utf8"));
}

export default createFile;
