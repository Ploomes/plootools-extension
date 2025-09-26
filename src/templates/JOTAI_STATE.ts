import { TCreateContentAux } from '../utils/createContentAux';
import {
  generateAtomContent,
  generateDispatchContent,
  generateIndexContent,
  generateStateContent,
} from '../utils/generators';

interface IJotaiFile {
  name: string;
  content: ((props: TCreateContentAux) => string) | string;
}

const JOTAI_STATE: Record<string, IJotaiFile> = {
  index: {
    name: 'index.ts',
    content: generateIndexContent,
  },
  atom: {
    name: 'atom.ts',
    content: generateAtomContent,
  },
  dispatch: {
    name: 'dispatch.ts',
    content: generateDispatchContent,
  },
  state: {
    name: 'state.ts',
    content: generateStateContent,
  },
};

export default JOTAI_STATE;
