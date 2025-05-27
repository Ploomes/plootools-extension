import { camelCase } from "lodash";
import toPascalCase from "./toPascalCase";
import { format, Options } from "prettier";

export interface IBuildTemplate {
  template: string;
  folderName: string;
  fileName: string;
  functionName?: string;
  prettier?: {
    active?: boolean;
    options?: Options;
  }
}

function buildTemplate(props: IBuildTemplate) {
  const {
    folderName,
    template,
    fileName,
    functionName = '',
    prettier = {
      active: true,
      options: {
        semi: true,
        trailingComma: "all",
        tabWidth: 2,
        singleQuote: true,
        jsxSingleQuote: true,
        bracketSpacing: true,
        parser: fileName.endsWith('.ts') ? 'babel-ts' : 'babel'
      }
    }
  } = props;
  const matchTemplateVars = /\@(.*?)\@/g;
  const replacer = mapVariables(folderName, fileName, functionName);
  const replacerTemplate = template.replace(matchTemplateVars, replacer);

  const prettierTemplate = format(replacerTemplate, prettier.options);

  return {
    template: prettier.active ? prettierTemplate : replacerTemplate,
    fileName: fileName.replace(matchTemplateVars, replacer)
  };
};

function mapVariables(folderName: string, fileName: string, functionName: string) {
  const vars = new Map();
  const folderNamePascalCase = toPascalCase(folderName);
  const folderNameCamelCase = camelCase(folderName);

  const fileNameCamelCase = camelCase(fileName);
  const fileNamePascalCase = toPascalCase(fileName);

  vars.set('folderName', folderName);
  vars.set("folderName(pascal-case)", folderNamePascalCase);
  vars.set("folderName(camel-case)", folderNameCamelCase);

  vars.set('fileName', fileName);
  vars.set("fileName(pascal-case)", fileNamePascalCase);
  vars.set("fileName(camel-case)", fileNameCamelCase);

  vars.set('functionName', functionName);

  return (match: string, offset: string): string => {
    const value = vars.get(offset);
    return value || "KeyNameNotFound";
  };
}

export default buildTemplate;