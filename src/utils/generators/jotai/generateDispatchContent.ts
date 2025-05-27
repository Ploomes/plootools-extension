import createContentAux, { TCreateContentAux } from '../../createContentAux';
import generateNames from './generateNames';

function generateDispatchContent(props: TCreateContentAux) {
  const { useAtomFamily = false, useReset = false, typeHookReset = "useResetAtom" } = props;

  const utilsImport = createContentAux("jotai")({ useReset, typeHookReset });
  const { atom: atomName, atomInterface, dispatch: dispatchName } = generateNames("folderName", useAtomFamily);

  const imports = [
    "import { useSetAtom } from 'jotai';",
    utilsImport,
    `import ${atomName}, { ${atomInterface} } from './atom';`
  ].filter(Boolean).join('\n');

  const functions = [
    `const set = useSetAtom(${atomName}${useAtomFamily ? '(value)' : ''});`,
    useReset ? `const reset = useResetAtom(${atomName}${useAtomFamily ? '(value)' : ''})` : ''
  ].filter(Boolean).join('\n');

  return String.raw`
    ${imports}
    
    const ${dispatchName} = (${useAtomFamily ? `value: string` : ''}) => {
      ${functions}

      return {
        update(newState: Partial<${atomInterface}>) {
          set((prev) => ({ ...prev, ...newState }));
        },
        set,
        ${useReset ? `reset` : ''}
      };
    };

    export default ${dispatchName};
  `;
};

export default generateDispatchContent;