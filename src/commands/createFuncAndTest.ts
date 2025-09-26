import { Uri } from 'vscode';
import { ICallbackCommand } from '../types';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve, basename } from 'path';
import { FUNC } from '../templates';
import { buildTemplate, createFile, createTestFile, prettifyTemplate, showMessage } from '../utils';
import { config } from '../config';

async function maybeCreateIndexFile({
  extensionName,
  targetPath,
  configTemplate,
}: {
  extensionName: string;
  folderName: string;
  targetPath: string;
  configTemplate?: { createIndex: boolean; templateIndex: string };
}) {
  if (!configTemplate) {
    return;
  }

  const indexFilePath = resolve(targetPath, `index.${extensionName}`);
  const notExistIndexFile = !existsSync(indexFilePath);

  if (configTemplate.createIndex && configTemplate.templateIndex && notExistIndexFile) {
    const formatted = await prettifyTemplate(configTemplate.templateIndex, {
      parser: extensionName.endsWith('ts') ? 'babel-ts' : 'babel',
    });
    await createFile(indexFilePath, formatted);
  }
}

async function updateIndexFile({
  extensionName,
  targetPath,
  fileName,
  folderName,
}: {
  extensionName: string;
  targetPath: string;
  fileName: string;
  folderName: string;
}) {
  const indexFilePath = resolve(targetPath, `index.${extensionName}`);
  if (!existsSync(indexFilePath)) {
    return;
  }

  const fileData = await readFile(indexFilePath, 'utf-8');
  const newTemplate = `
    import ${fileName} from "./${fileName}";
    ${fileData.replace(/export(\s|){/g, (match) => `${match} ${fileName},`)}
  `;
  const { template: templateIndex } = await buildTemplate({
    fileName,
    folderName,
    template: newTemplate,
  });

  await writeFile(indexFilePath, templateIndex, { encoding: 'utf-8' });
}

async function createFuncAndTest(props: ICallbackCommand) {
  const { fileName, extensionName, context, path: rawPath } = props;

  try {
    if (!fileName || !extensionName) {
      throw new Error('Missing fileName or extensionName');
    }

    const targetPath = Uri.parse(rawPath).fsPath;
    const fileNameWithExtensionType = `${fileName}.${extensionName}`;
    const filePath = resolve(targetPath, fileNameWithExtensionType);

    if (existsSync(filePath)) {
      return showMessage.error(`File "${fileName}" already exists!`);
    }

    // Template: from workspace state or default FUNC
    const stateFunc = context?.workspaceState.get<string>(`${config.app}_func`);
    const funcTemplates = stateFunc ? eval(stateFunc) : FUNC;
    const currentTemplate = funcTemplates[extensionName];
    const folderName = basename(targetPath);

    // Build main file template
    const { template } = await buildTemplate({
      fileName: fileNameWithExtensionType,
      folderName,
      template: currentTemplate.content,
      functionName: fileName,
    });

    await createFile(filePath, template);
    // Maybe create index file
    await maybeCreateIndexFile({
      extensionName,
      folderName,
      targetPath,
      configTemplate: currentTemplate?.config,
    });

    // Update index with new file
    await updateIndexFile({
      extensionName,
      folderName,
      targetPath,
      fileName,
    });

    // Create test file
    await createTestFile({
      ...props,
      baseUrl: targetPath,
      fileName,
      pathVscode: rawPath,
    });

    showMessage.info('File created successfully!');
  } catch (err: any) {
    console.log(err);
    showMessage.error(`Could not create the files! ${err.message ?? ''}`);
  }
}

export default createFuncAndTest;
