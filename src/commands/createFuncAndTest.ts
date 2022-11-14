import { Uri } from "vscode";
import { ICallbackCommand } from "../types";
import { existsSync, readFile, writeFileSync } from "fs";
import { resolve, basename } from "path";
import { FUNC } from "../templates";
import { buildTemplate, createFile, createTestFile, showMessage } from "../utils";

async function createFuncAndTest(props: ICallbackCommand){
  try {
    const {
      fileName,
      extensionName
    } = props;

    if(!fileName || !extensionName) {
      throw new Error();
    }

    const path = Uri.parse(props.path).fsPath;
    const file = `${fileName}.${extensionName}`;
    const checkFileExist = existsSync(resolve(path, file));

    if(checkFileExist) {
      return showMessage.error('File already exists!');
    }

    const keyExtension = extensionName as keyof typeof FUNC;
    const currentTemplate = FUNC[keyExtension];
    const folderName = basename(path);

    const { template } = buildTemplate({
      fileName: '',
      folderName,
      template: currentTemplate.content,
      functionName: fileName
    });

    await createFile(`${props.path}/${file}`, template);

    if(existsSync(resolve(path, 'index.ts')) || existsSync(resolve(path, 'index.js'))) {
      const isTs = existsSync(resolve(path, 'index.ts'));
      const currentFile = `index.${isTs ? 'ts' : 'js'}`;
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
      baseUrl: path,
      fileName,
      pathVscode: props.path
    });
  } catch (err) {
    showMessage.error('Could not create the files!');
  }
};

export default createFuncAndTest;