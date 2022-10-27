import { window } from "vscode";
import { ICallbackCommand } from "../types";
import * as fs from "fs";
import * as _path from "path";
import { config } from "../config";
import { JEST } from "../templates";
import { buildTemplate, createFile } from "../utils";

async function createTests(props: ICallbackCommand) {
  const { path, fsPath } = props;
  const currentFolder = _path.resolve(fsPath);
  const regFileExtension = /\.(js|ts)$/g;
  const regFileTest = /\.(test)\.(js|ts)$/g;
  const { extension, content } = JEST;

  fs.readdir(currentFolder, (err, files) => {
    if(err) {
      return window.showErrorMessage(`${config.displayName}: Files not found`);
    }
    files.forEach((file)=> {
      const isFile = fs.statSync(`${currentFolder}/${file}`).isFile();
      if(isFile) {
        const fileName = file.replace(regFileTest.test(file) ? regFileTest : regFileExtension, '');

        if(!fileName.includes('index')) {
          if(!fs.existsSync(`${currentFolder}/${fileName}.test.${extension}`)) {
            const { fileName: newFileName, template } = buildTemplate({
              fileName,
              folderName: _path.basename(currentFolder),
              template: content
            });
            const fileWithExtension = `${newFileName}.test.${extension}`;
            createFile(`${path}/${fileWithExtension}`, template).then(()=>{
              window.showInformationMessage(`${config.displayName}: Test ${fileWithExtension} created successfully!`);
            });
          }else if(!regFileTest.test(file)) {
            window.showErrorMessage(`${config.displayName}: ${file} test already exists`);
          }
        }
      }
    });
  });
};

export default createTests;
