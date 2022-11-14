import { existsSync } from "fs";
import { basename, resolve } from "path";
import { JEST } from "../templates";
import buildTemplate from "./buildTemplate";
import createFile from "./createFile";
import showMessage from "./showMessage";

interface IProps {
  baseUrl: string;
  fileName: string;
  pathVscode: string;
}

function createTestFile(props: IProps) {
  const {
    baseUrl,
    fileName,
    pathVscode
  } = props;
  const regExtension = /\.(ts|js)$/g;
  const [name] = fileName.split(regExtension);
  const { content, extension } = JEST;

  if(existsSync(resolve(baseUrl, `${name}.test.${extension}`))) {
    return showMessage.error(`${name} test already exists`);
  }

  const folderName = basename(baseUrl);
  const { fileName: newFileName, template } = buildTemplate({
    fileName: name,
    folderName,
    template: content
  });
  const fileWithExtension = `${newFileName}.test.${extension}`;
  createFile(`${pathVscode}/${fileWithExtension}`, template).then(()=>{
    showMessage.info(`Test ${fileWithExtension} created successfully!`);
  });
}

export default createTestFile;
