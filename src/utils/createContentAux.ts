type TTypeCreate = "jotai"

export type TCreateContentAux = TTypeCreate extends "jotai" ? { useAtomFamily?: boolean; useReset?: boolean, typeHookReset?: "atomWithReset" |"useResetAtom" } : {};

function createContentAux(type: TTypeCreate) {
  return (props: TCreateContentAux)=> {
    const output: string[] = [];
    if(type === 'jotai') {
      const { useAtomFamily, useReset, typeHookReset = "atomWithReset" } = props;
      const useUtils = Boolean(useAtomFamily || useReset);

      if(useUtils) {
        const hooks = [];
        if(useAtomFamily) {
          hooks.push('atomFamily');
        }
        if(useReset) {
          hooks.push(typeHookReset);
        }
        output.push(
          `import {${hooks.join(',')}} from 'jotai/utils';`
        );
      }
    }
    return output.join('\n');
  };
};

export default createContentAux;
