import ITemplateContentContext from '../types/ITemplateContentContext';

interface IRecoilFile {
  name: string;
  content: ((ctx: ITemplateContentContext) => string) | string;
}

function generateIndexContent({ selected }: ITemplateContentContext) {
  const hasState = selected.has('state');
  const hasDispatch = selected.has('dispatch');
  const hasGetState = selected.has('getState');

  const imports = [
    hasState ? `import use@folderName(pascal-case)@ from "./state";` : '',
    hasDispatch ? `import use@folderName(pascal-case)@Dispatch from "./dispatch";` : '',
    hasGetState ? `import use@folderName(pascal-case)@State from "./getState";` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const exportNames = [
    hasState ? 'use@folderName(pascal-case)@' : '',
    hasDispatch ? 'use@folderName(pascal-case)@Dispatch' : '',
    hasGetState ? 'use@folderName(pascal-case)@State' : '',
  ].filter(Boolean);

  const exportsBlock = exportNames.length ? `export {\n  ${exportNames.join(',\n  ')}\n};` : '';

  return [imports, exportsBlock].filter(Boolean).join('\n\n');
}

const RECOIL_STATE: Record<string, IRecoilFile> = {
  index: {
    name: 'index.ts',
    content: generateIndexContent,
  },
  atom: {
    name: 'atom.ts',
    content: `
      import { atom } from 'recoil';

      const @folderName(camel-case)@Atom = atom<any>({
        key: '@folderName(camel-case)@',
        default: null,
      });

      export default @folderName(camel-case)@Atom;
    `,
  },
  dispatch: {
    name: 'dispatch.ts',
    content: `
      import { useSetRecoilState } from "recoil";
      import @folderName(camel-case)@Atom from "./atom";

      const use@folderName(pascal-case)@Dispatch = () => useSetRecoilState(@folderName(camel-case)@Atom);
      export default use@folderName(pascal-case)@Dispatch;
    `,
  },
  getState: {
    name: 'getState.ts',
    content: `
      import { useRecoilCallback } from "recoil";
      import @folderName(camel-case)@Atom from "./atom";

      const useGet@folderName(pascal-case)@State = () => {
        return useRecoilCallback(({ snapshot }) => () => {
          return snapshot.getLoadable(@folderName(camel-case)@Atom).getValue();
        }, []);
      }

      export default useGet@folderName(pascal-case)@State;
    `,
  },
  state: {
    name: 'state.ts',
    content: `
    import { useRecoilState } from "recoil";
    import @folderName(camel-case)@Atom from "./atom";

    const use@folderName(pascal-case)@ = () => useRecoilState(@folderName(camel-case)@Atom);
    export default use@folderName(pascal-case)@;
    `,
  },
};

export default RECOIL_STATE;
