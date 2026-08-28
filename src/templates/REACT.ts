import ITemplateContentContext from '../types/ITemplateContentContext';
import type { Options } from 'prettier';

interface IReactFile {
  name: string;
  content: ((ctx: ITemplateContentContext) => string) | string;
  prettier?: { active?: boolean; options?: Options };
}

const styleContent = `import { styled, css } from "@packages/react-ploomes-design-system";

const @folderName(pascal-case)@Wrapper = styled.div${
  '`${() => css`' +
  `
  &.@folderName@-component{
  }
` +
  '`}`'
};

export default @folderName(pascal-case)@Wrapper;
`;

function generateIndexContent({ selected }: ITemplateContentContext) {
  const hasController = selected.has('controller');
  const hasProps = selected.has('props');

  const imports = [
    hasController ? `import @folderName(pascal-case)@ from "./@folderName@.controller";` : '',
    hasProps ? `import I@folderName(pascal-case)@ from "./@folderName@.props";` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const exportsBlock = [
    hasController ? `export { @folderName(pascal-case)@ };` : '',
    hasProps ? `export type { I@folderName(pascal-case)@ };` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return [imports, exportsBlock].filter(Boolean).join('\n\n');
}

function generateViewContent({ selected }: ITemplateContentContext) {
  const hasStyle = selected.has('style');
  const wrapperImport = hasStyle
    ? `import @folderName(pascal-case)@Wrapper from "./@folderName@.style";`
    : '';
  const tag = hasStyle ? '@folderName(pascal-case)@Wrapper' : 'div';

  return `import React from "react";
    ${wrapperImport}

    interface IProps {}

    const @folderName(pascal-case)@ViewNoMemo: React.FC<IProps> = () => (
      <${tag} className="@folderName@-component">
        <h1>@folderName(pascal-case)@</h1>
      </${tag}>
    );

    const @folderName(pascal-case)@View = React.memo(@folderName(pascal-case)@ViewNoMemo);
    export default @folderName(pascal-case)@View;`;
}

function generateControllerContent({ selected }: ITemplateContentContext) {
  const hasProps = selected.has('props');
  const propsImport = hasProps
    ? `import I@folderName(pascal-case)@ from "./@folderName@.props";`
    : '';
  const propsType = hasProps ? '<I@folderName(pascal-case)@>' : '';

  return `import React from "react";
    import @folderName(pascal-case)@View from "./@folderName@.view";
    ${propsImport}

    const @folderName(pascal-case)@: React.FC${propsType} = () => {
      return <@folderName(pascal-case)@View />;
    };

    export default @folderName(pascal-case)@;`;
}

const REACT: Record<string, IReactFile> = {
  index: {
    name: 'index.ts',
    content: generateIndexContent,
  },
  style: {
    name: '@folderName@.style.ts',
    content: styleContent,
    prettier: {
      active: false,
      options: {},
    },
  },
  view: {
    name: '@folderName@.view.tsx',
    content: generateViewContent,
  },
  controller: {
    name: '@folderName@.controller.tsx',
    content: generateControllerContent,
  },
  props: {
    name: '@folderName@.props.ts',
    content: `interface I@folderName(pascal-case)@ {};

    export default I@folderName(pascal-case)@;`,
  },
};

export default REACT;
