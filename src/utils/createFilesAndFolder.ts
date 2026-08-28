import { Uri } from 'vscode';
import toPascalCase from './toPascalCase';
import { ICallbackCommand, TTemplate } from '@/types';
import { resolve } from 'path';
import { existsSync } from 'fs';
import showMessage from './showMessage';
import createDirectory from './createDirectory';
import { config } from '../config';
import buildTemplate, { IBuildTemplate } from './buildTemplate';
import createFile from './createFile';
import camelCase from 'lodash/camelCase';
import selectFilesToCreate from './selectFilesToCreate';

type TTypeFormatString = 'CAMEL' | 'PASCAL';

interface ICreateFilesAndFolder extends ICallbackCommand {
  folderName: string;
  isCreateFilesOnly: boolean;
  keyOnWorkspace: string;
  defaultTemplate: TTemplate;
  /** Extra data forwarded to a template file's `content` function, alongside `selected`. */
  contentContext?: Record<string, unknown>;
  formats?: {
    folderName?: TTypeFormatString;
    fileName?: TTypeFormatString;
  };
}

async function createFilesAndFolder(props: ICreateFilesAndFolder) {
  const {
    path,
    folderName,
    context,
    isCreateFilesOnly,
    keyOnWorkspace,
    defaultTemplate,
    contentContext = {},
    formats = {
      folderName: 'PASCAL',
    },
  } = props;

  try {
    const getPath = Uri.parse(path).fsPath;
    let formatedFolderName = '';

    switch (formats.folderName) {
      case 'CAMEL':
        formatedFolderName = camelCase(folderName);
        break;
      default:
        formatedFolderName = toPascalCase(folderName);
        break;
    }

    let dir = getPath;
    const pathToCreateFiles = isCreateFilesOnly ? path : `${path}/${formatedFolderName}`;
    if (isCreateFilesOnly) {
      dir = resolve(getPath);
    } else {
      dir = resolve(`${getPath}/${formatedFolderName}`);
    }

    if (!isCreateFilesOnly && existsSync(dir)) {
      return showMessage.error('Folder already exists!');
    }

    const currentStateWorkspace = context?.workspaceState.get(
      `${config.app}_${keyOnWorkspace}`,
    ) as string;
    const currentTemplates = currentStateWorkspace ? eval(currentStateWorkspace) : defaultTemplate;

    const { selectedKeys } = await selectFilesToCreate(
      currentTemplates as Record<string, { name: string }>,
      folderName,
    );

    if (!selectedKeys) {
      return showMessage.error('Operation Cancelled');
    }
    if (selectedKeys.length === 0) {
      return showMessage.info('No files selected. Nothing to create.');
    }

    if (!isCreateFilesOnly) {
      await createDirectory(`${path}/${formatedFolderName}`);
    }

    const promises = [];
    const selected = new Set(selectedKeys);

    for (const keyFile of selectedKeys) {
      const key = keyFile as keyof typeof currentTemplates;
      const file = currentTemplates[key] as {
        name: string;
        content: ((ctx: Record<string, unknown>) => string) | string;
        prettier?: unknown;
      };

      const resolvedContent =
        typeof file.content === 'function'
          ? file.content({ ...contentContext, selected })
          : file.content;

      const optionsTemplate: IBuildTemplate = {
        folderName,
        template: resolvedContent,
        fileName: file.name,
      };

      if (file.prettier) {
        optionsTemplate['prettier'] = file.prettier as IBuildTemplate['prettier'];
      }

      const { fileName, template } = await buildTemplate(optionsTemplate);
      if (!existsSync(resolve(`${dir}/${fileName}`))) {
        const create = createFile(`${pathToCreateFiles}/${fileName}`, template);
        promises.push(create);
      }
    }
    return await Promise.all(promises)
      .then(() => {
        return showMessage.info('Successfully created files!');
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    console.log(error);
    return showMessage.error('The folder and files could not be created!');
  }
}

export default createFilesAndFolder;
