import { ICallbackCommand } from "../types";
import { readdir, statSync } from "fs";
import { resolve } from "path";
import { createTestFile, showMessage } from "../utils";

async function createTests(props: ICallbackCommand) {
  const { fsPath, path } = props;
  const currentFolder = resolve(fsPath);

  readdir(currentFolder, (err, files) => {
    if(err) {
      return showMessage.error('Files not found!');
    }
    files.forEach((file)=> {
      const isFile = statSync(`${currentFolder}/${file}`).isFile();
      try {
        const isValidFile = !/\.(test|spec)\.(ts|js)/g.test(file) && !/^index/.test(file);
        if(isFile && isValidFile) {
          createTestFile({
            baseUrl: fsPath,
            fileName: file,
            pathVscode: path
          });
        }
      } catch (err) {
        showMessage.error(`Unable to create a test of the file  ${file}`);
      }
    });
  });
};

export default createTests;
