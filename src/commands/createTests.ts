import { ICallbackCommand } from '../types';
import { readdir, statSync } from 'fs';
import { resolve } from 'path';
import { createTestFile, showMessage } from '../utils';
import { Uri } from 'vscode';

async function createTests(props: ICallbackCommand) {
  const { fsPath, path } = props;
  const currentFsPath = fsPath || Uri.parse(path).fsPath;

  const currentFolder = resolve(currentFsPath);
  const promises: Promise<void>[] = [];
  readdir(currentFolder, (err, files) => {
    if (err) {
      return showMessage.error('Files not found!');
    }
    files.forEach((file) => {
      const isFile = statSync(`${currentFolder}/${file}`).isFile();
      try {
        const isValidFile = !/\.(test|spec)\.(ts|js)/g.test(file) && !/^index/.test(file);
        if (isFile && isValidFile) {
          promises.push(
            createTestFile({
              ...props,
              baseUrl: currentFsPath,
              fileName: file,
              pathVscode: path,
            }),
          );
        }
      } catch (err) {
        showMessage.error(`Unable to create a test of the file  ${file}`);
      }
    });
  });
  return Promise.all(promises);
}

export default createTests;
