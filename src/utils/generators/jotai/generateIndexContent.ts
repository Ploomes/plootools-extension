import { TCreateContentAux } from '../../createContentAux';
import ITemplateContentContext from '../../../types/ITemplateContentContext';
import generateNames from './generateNames';

function generateIndexContent(props: TCreateContentAux & ITemplateContentContext) {
  const { useAtomFamily = false, selected } = props;
  const { atom, dispatch, state } = generateNames('folderName', useAtomFamily);

  const hasAtom = selected.has('atom');
  const hasDispatch = selected.has('dispatch');
  const hasState = selected.has('state');

  const imports = [
    hasAtom ? `import ${atom} from "./atom";` : '',
    hasDispatch ? `import ${dispatch} from "./dispatch";` : '',
    hasState ? `import ${state} from "./state";` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const exportNames = [hasAtom && atom, hasDispatch && dispatch, hasState && state].filter(Boolean);
  const exportsBlock = exportNames.length ? `export {\n  ${exportNames.join(',\n  ')}\n};` : '';

  return [imports, exportsBlock].filter(Boolean).join('\n\n');
}

export default generateIndexContent;
