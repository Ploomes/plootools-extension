import { TCreateContentAux } from '../../createContentAux';
import generateNames from './generateNames';

function generateStateContent (props: TCreateContentAux){
  const { useAtomFamily = false } = props;
  const { atom: atomName, state: stateName } = generateNames("folderName", useAtomFamily);

  return String.raw`
    import { useAtomValue } from 'jotai';
    import ${atomName} from './atom';

    const ${stateName} = (${useAtomFamily ? 'value: string' : ''}) => {
      return useAtomValue(${atomName}${useAtomFamily ? '(value)' : ''});
    };

    export default ${stateName};
  `;
};

export default generateStateContent;
