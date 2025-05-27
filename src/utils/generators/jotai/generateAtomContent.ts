import createContentAux, { TCreateContentAux } from "../../createContentAux";
import generateNames from "./generateNames";

function generateAtomContent(props: TCreateContentAux) {
  const { useAtomFamily = false, useReset = false } = props;
  const typeAtom = useReset ? 'atomWithReset' : 'atom';
  const utilsImport = createContentAux("jotai")({ useAtomFamily, useReset });

  const { atom, atomInterface } = generateNames("folderName", useAtomFamily);

  const atomCode = useAtomFamily
    ? `atomFamily((value: string) => ${typeAtom}<${atomInterface}>({ value }));`
    : `${typeAtom}<${atomInterface}>({} as ${atomInterface})`;

  const atomImport = useReset ? '' : "import { atom } from 'jotai';";

  const imports = [
    atomImport,
    utilsImport
  ].filter(Boolean).join('\n');

  return String.raw`
    ${imports}

    export interface ${atomInterface} {
      value: string;
    }

    const ${atom} = ${atomCode};

    export default ${atom};
  `;
};

export default generateAtomContent;
