import { readFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import createFile from './createFile';
import showMessage from './showMessage';
import prettifyTemplate from './prettifyTemplate';

function getTemplate(name: string) {
  return readFileSync(join(__dirname, '..', 'assets', 'templates', `${name}.txt`), {
    encoding: 'utf8',
  });
}

async function createTemplateFile(folderName: string, template: string, fileName: string) {
  const prettierTemplate = await prettifyTemplate(
    `
    module.exports = ${template};
  `,
    {
      trailingComma: 'es5',
      parser: 'babel',
    },
  );
  const file = resolve(folderName, `${fileName}.js`);
  return createFile(file, prettierTemplate).then(() => file);
}

async function createFileCustomTemplates(folderName: string) {
  const react = getTemplate('react');
  const jest = getTemplate('jest');
  const func = getTemplate('func');
  const jotai = getTemplate('jotai');
  const recoil = getTemplate('recoil');

  return mkdir(folderName, { recursive: true })
    .then(() => {
      return Promise.all([
        createTemplateFile(folderName, react, 'react'),
        createTemplateFile(folderName, jest, 'jest'),
        createTemplateFile(folderName, func, 'func'),
        createTemplateFile(folderName, jotai, 'jotai'),
        createTemplateFile(folderName, recoil, 'recoil'),
      ]);
    })
    .then(() => showMessage.info('Configuration folder created successfully!'))
    .catch(() => showMessage.error('Unable to create configuration folder!'));
}

export default createFileCustomTemplates;
