import { TCreateContentAux } from '../../createContentAux';
import generateNames from './generateNames';

function generateIndexContent(props: TCreateContentAux) {
  const { useAtomFamily = false } = props;
  const { atom, dispatch, state } = generateNames('folderName', useAtomFamily);

  return String.raw`
    import ${atom} from "./atom";
    import ${dispatch} from "./dispatch";
    import ${state} from "./state";

    export {
      ${atom},
      ${dispatch},
      ${state}
    };
  `;
}

export default generateIndexContent;
