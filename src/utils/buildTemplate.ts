import { camelCase } from 'lodash';
import toPascalCase from './toPascalCase';
import type { Options } from 'prettier';
import prettifyTemplate from './prettifyTemplate';

export interface IBuildTemplate {
  template: string;
  folderName: string;
  fileName: string;
  functionName?: string;
  prettier?: {
    active?: boolean;
    options?: Options;
  };
}

async function buildTemplate(
  props: IBuildTemplate,
): Promise<{ template: string; fileName: string }> {
  const fileIsTs = /\.(tsx?)$/.test(props.fileName);
  const {
    folderName,
    template,
    fileName,
    functionName = '',
    prettier = {
      active: true,
      options: {
        jsxSingleQuote: true,
        parser: fileIsTs ? 'babel-ts' : 'babel',
      },
    },
  } = props;
  const matchTemplateVars = /@(.*?)@/g;
  const replacer = mapVariables(folderName, fileName, functionName);
  const replacedTemplate = template.replace(matchTemplateVars, replacer);
  const replacedFileName = fileName.replace(matchTemplateVars, replacer);

  if (prettier.active) {
    const prettierTemplate = await prettifyTemplate(replacedTemplate, prettier.options);
    return {
      template: prettierTemplate,
      fileName: replacedFileName,
    };
  }

  return {
    template: replacedTemplate,
    fileName: replacedFileName,
  };
}

function mapVariables(folderName: string, fileName: string, functionName: string) {
  const vars = new Map();
  const folderNamePascalCase = toPascalCase(folderName);
  const folderNameCamelCase = camelCase(folderName);

  const fileNameCamelCase = camelCase(fileName);
  const fileNamePascalCase = toPascalCase(fileName);

  vars.set('folderName', folderName);
  vars.set('folderName(pascal-case)', folderNamePascalCase);
  vars.set('folderName(camel-case)', folderNameCamelCase);

  vars.set('fileName', fileName);
  vars.set('fileName(pascal-case)', fileNamePascalCase);
  vars.set('fileName(camel-case)', fileNameCamelCase);

  vars.set('functionName', functionName);

  return (match: string, offset: string): string => {
    const value = vars.get(offset);
    return value || 'KeyNameNotFound';
  };
}

export default buildTemplate;
