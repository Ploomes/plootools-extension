import { TCreateContentAux } from "../utils/createContentAux";
import { createContentAux } from "../utils";

const JOTAI_STATE: {
  [key: string]: {
    name: string;
    content: ((props: TCreateContentAux) => string) | string;
  }
} = {
  index: {
    name: 'index.ts',
    content: (props: TCreateContentAux)=> {
      const { useAtomFamily } = props;

      const tagFamily = `${useAtomFamily ? 'Family' : ''}`;
      const atomName = `use@folderName(pascal-case)@Atom${tagFamily}`;
      const dispatchName = `use@folderName(pascal-case)@Dispatch`;
      const stateName = `use@folderName(pascal-case)@State`;

      return `import ${atomName} from "./atom";
      import ${dispatchName} from "./dispatch";
      import ${stateName} from "./state";

      export {
        ${atomName},
        ${dispatchName},
        ${stateName}
      };
    `
    }
  },
  atom: {
    name: 'atom.ts',
    content: (props: TCreateContentAux) => {
      const { useAtomFamily, useReset } = props;

      const utilsImport = createContentAux("jotai")({ useAtomFamily, useReset });
      const tagFamily = `${useAtomFamily ? 'Family' : ''}`;

      const atomName = `@folderName(camel-case)@Atom${tagFamily}`;
      const interfaceName = `I@folderName(pascal-case)@Atom${tagFamily}`;
      const typeAtom = useReset ? 'atomWithReset' : 'atom';

      return `import { atom } from 'jotai';
      ${utilsImport}

      export interface ${interfaceName} {
        value: string;
      };

      const ${atomName} = ${ useAtomFamily ? `atomFamily((state: ${interfaceName})=> ${typeAtom}(state))` : `${typeAtom}<${interfaceName}>()`};

      export default ${atomName};
      `
    }
  },
  dispatch: {
    name: 'dispatch.ts',
    content: (props: TCreateContentAux)=> {
      const { useAtomFamily, useReset, typeHookReset = "useResetAtom" } = props;
      const utilsImport = createContentAux("jotai")({ useReset, typeHookReset });
      const tagFamily = `${useAtomFamily ? 'Family' : ''}`;

      const atomName = `@folderName(camel-case)@Atom${tagFamily}`;
      const interfaceName = `I@folderName(pascal-case)@Atom${tagFamily}`;
      const dispatchName = `use@folderName(pascal-case)@Dispatch`;

      return `
        import { useSetAtom } from 'jotai';
        ${utilsImport}
        import ${atomName}, { ${interfaceName} } from './atom';

        const ${dispatchName} = () => {
          const set = useSetAtom(${atomName});

          return {
            update(newState: Partial<${interfaceName}>){
              set((prev)=> ({ ...prev, ...newState }));
            },
            set,
            ${ useReset ? `reset: ${typeHookReset}(${atomName})` : ''}
          }
        };

        export default ${dispatchName};
      `;
    }
  },
  state: {
    name: "state.ts",
    content: (props: TCreateContentAux)=> {
      const { useAtomFamily } = props;
      const tagFamily = `${useAtomFamily ? 'Family' : ''}`;
      
      const atomName = `@folderName(camel-case)@Atom${tagFamily}`;
      const stateName = `use@folderName(pascal-case)@State`;

      return `import { useAtomValue } from 'jotai';
      import ${atomName} from './atom';

      const ${stateName} = () => {
        return useAtomValue(${atomName});
      };
      
      export default ${stateName};
      `;
    }
  }
};

export default JOTAI_STATE;