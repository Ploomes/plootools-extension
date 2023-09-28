import { Uri } from "vscode";
import { ICallbackCommand } from "../types";
import { existsSync, readFile, writeFileSync } from "fs";
import { resolve, basename } from "path";
import { FUNC } from "../templates";
import { buildTemplate, createFile, createTestFile, showMessage } from "../utils";
import { config } from "../config";
import { format } from "prettier";

async function createFuncAndTest(props: ICallbackCommand){
  const {
    fileName,
    extensionName,
    context
  } = props;

  try {
    if(!fileName || !extensionName) {
      throw new Error();
    }

    const path = Uri.parse(props.path).fsPath;
    const file = `${fileName}.${extensionName}`;
    const checkFileExist = existsSync(resolve(path, file));

    if(checkFileExist) {
      return showMessage.error(`File with name ${fileName} already exists!`);
    }
    
    const stateFunc = context?.workspaceState.get(`${config.app}_func`) as string;
    const func = stateFunc ? eval(stateFunc) : FUNC;
    const currentTemplate = func[extensionName];
    const configTemplate = currentTemplate?.config;
    const folderName = basename(path);

    const { template } = buildTemplate({
      fileName: '',
      folderName,
      template: currentTemplate.content,
      functionName: fileName
    });

    await createFile(`${props.path}/${file}`, template);

    if(configTemplate) {
      const { createIndex, templateIndex } = configTemplate;
      const notExistIndexFile = !existsSync(resolve(path, `index.${extensionName}`));
      if(createIndex && templateIndex && notExistIndexFile) {
        const templateIndex = format(configTemplate.templateIndex, {
          semi: true,
          trailingComma: "all",
          tabWidth: 2,
        });
        await createFile(`${props.path}/index.${extensionName}`, templateIndex);
      }
    }

    if(existsSync(resolve(path, `index.${extensionName}`))) {
      const currentFile = `index.${extensionName}`;
      readFile(resolve(path, currentFile), 'utf-8', (err, data) => {
        if(err) {
          throw new Error();
        }
        const newTemplate = `
        import ${fileName} from "./${fileName}";
        ${data.replace(/export(\s|){/g, (match) => {
          return `${match} ${fileName},`;
        })}
        `;

        const { template: templateIndex } = buildTemplate({
          fileName,
          folderName,
          template: newTemplate
        });

        writeFileSync(resolve(path, currentFile), templateIndex, { encoding: 'utf-8' });
      });
    }

    showMessage.info('File created successfully!');
    createTestFile({
      ...props,
      baseUrl: path,
      fileName,
      pathVscode: props.path
    });
  } catch (err) {
    showMessage.error('Could not create the files!');
  }
};

export default createFuncAndTest;