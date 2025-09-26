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

const REACT = {
  index: {
    name: 'index.ts',
    content: `import @folderName(pascal-case)@ from "./@folderName@.controller";
    import I@folderName(pascal-case)@ from "./@folderName@.props";

    export { @folderName(pascal-case)@ };
    export type { I@folderName(pascal-case)@ }`,
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
    content: `import React from "react";
    import @folderName(pascal-case)@Wrapper from "./@folderName@.style";

    interface IProps {}

    const @folderName(pascal-case)@ViewNoMemo: React.FC<IProps> = () => (
      <@folderName(pascal-case)@Wrapper className="@folderName@-component">
        <h1>@folderName(pascal-case)@</h1>
      </@folderName(pascal-case)@Wrapper>
    );

    const @folderName(pascal-case)@View = React.memo(@folderName(pascal-case)@ViewNoMemo);
    export default @folderName(pascal-case)@View;`,
  },
  controller: {
    name: '@folderName@.controller.tsx',
    content: `import React from "react";
    import @folderName(pascal-case)@View from "./@folderName@.view";
    import I@folderName(pascal-case)@ from "./@folderName@.props";

    const @folderName(pascal-case)@: React.FC<I@folderName(pascal-case)@> = () => {
      return <@folderName(pascal-case)@View />;
    };

    export default @folderName(pascal-case)@;`,
  },
  props: {
    name: '@folderName@.props.ts',
    content: `interface I@folderName(pascal-case)@ {};

    export default I@folderName(pascal-case)@;`,
  },
};

export default REACT;
