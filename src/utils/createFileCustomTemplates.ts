import { mkdirSync, readFileSync } from "fs";
import { mkdir } from "fs/promises";
import { join, resolve } from "path";
import { format } from "prettier";
import createFile from "./createFile";
import showMessage from "./showMessage";

function getTemplate(name: string) {
  return readFileSync(join(__dirname, '..', 'assets', 'templates', `${name}.txt`), { encoding: 'utf8' });
}

async function createTemplateFile(folderName: string, template: string, fileName: string) {
  const prettierTemplate = format(`
    module.exports = ${template};
  `, {
    trailingComma: "es5",
    tabWidth: 2,
  });
  const file = resolve(folderName, `${fileName}.js`);
  return createFile(file, prettierTemplate).then(()=> file);
}

async function createFileCustomTemplates(folderName: string){
  const react = getTemplate('react');
  const jest = getTemplate('jest');
  const func = getTemplate('func');

  mkdirSync(folderName, { recursive: true });

  return mkdir(folderName, { recursive: true }).then(()=>{
    return Promise.all(
      [
        createTemplateFile(folderName, react, 'react'),
        createTemplateFile(folderName, jest, 'jest'),
        createTemplateFile(folderName, func, 'func'),
      ]
    )
  })
  .then(()=> showMessage.info('Configuration folder created successfully!'))
  .catch(()=> showMessage.error('Unable to create configuration folder!'));
};

export default createFileCustomTemplates;