import toPascalCase from "./toPascalCase";
import { format } from "prettier";

interface IProps {
  template: string;
  folderName: string;
  fileName: string;
}
function buildTemplate(props: IProps) {
  const {
    folderName,
    template,
    fileName
  } = props;
  const matchTemplateVars = /\@(.*?)\@/g;
  const replacer = mapVariables(folderName, fileName);
  const replacerTemplate = template.replace(matchTemplateVars, replacer);

  const prettierTemplate = format(replacerTemplate, {
    semi: true,
    parser: "babel"
  });

  return {
    template: prettierTemplate,
    fileName: fileName.replace(matchTemplateVars, replacer)
  };
};

function mapVariables(folderName: string, fileName: string) {
  const vars = new Map();
  const folderNamePascalCase = toPascalCase(folderName);
  const fileNamePascalCase = toPascalCase(fileName);

  vars.set('folderName', folderName);
  vars.set("folderName(pascal-case)", folderNamePascalCase);

  vars.set('fileName', fileName);
  vars.set("fileName(pascal-case)", fileNamePascalCase);

  return (match: string, offset: string): string => {
    const value = vars.get(offset);
    return value || "KeyNameNotFound";
  };
}

export default buildTemplate;