import { config } from '../config';
import { existsSync } from 'fs';
import { basename, resolve } from 'path';
import { ICallbackCommand } from 'types';
import { JEST } from '../templates';
import buildTemplate from './buildTemplate';
import createFile from './createFile';
import showMessage from './showMessage';

interface IProps extends ICallbackCommand {
  baseUrl: string;
  fileName: string;
  pathVscode: string;
}

async function createTestFile(props: IProps) {
  const { baseUrl, fileName, pathVscode, context } = props;
  const regExtension = /\.(ts|js)$/g;
  const [name] = fileName.split(regExtension);
  const stateJest = context?.workspaceState.get(`${config.app}_jest`) as string;
  const jest = stateJest ? eval(stateJest) : JEST;

  const { content, extension } = jest;

  if (existsSync(resolve(baseUrl, `${name}.test.${extension}`))) {
    showMessage.error(`test file with name ${name} already exists`);
    return Promise.reject(`test file with name ${name} already exists`);
  }

  const folderName = basename(baseUrl);
  const { fileName: newFileName, template } = await buildTemplate({
    fileName: name,
    folderName,
    template: content,
  });
  const fileWithExtension = `${newFileName}.test.${extension}`;
  return createFile(`${pathVscode}/${fileWithExtension}`, template).then(() => {
    showMessage.info(`Test ${fileWithExtension} created successfully!`);
  });
}

export default createTestFile;
