const REACT = {
  index: {
    name: 'index.ts',
    content: `import @folderName(pascal-case)@ from "./@folderName@.controller";
    import I@folderName(pascal-case)@Props from "./@folderName@.props";

    export { @folderName(pascal-case)@ };
    export type { I@folderName(pascal-case)@Props }`
  },
  style: {
    name: '@folderName@.style.ts',
    content: `import { styled, css } from "@packages/react-ploomes-design-system";

    const @folderName(pascal-case)@Wrapper = styled.div${"`${() => css``}`"};

    export default @folderName(pascal-case)@Wrapper;
    `
  },
  view: {
    name: '@folderName@.view.tsx',
    content: `import React from "react";
    import @folderName(pascal-case)@Wrapper from "./@folderName@.style";

    const @folderName(pascal-case)@ViewNoMemo: React.FC = () => (
      <@folderName(pascal-case)@Wrapper>
        <h1>Hello World</h1>
      </@folderName(pascal-case)@Wrapper>
    );

    const @folderName(pascal-case)@View = React.memo(@folderName(pascal-case)@ViewNoMemo);
    export default @folderName(pascal-case)@View;`
  },
  controller: {
    name: '@folderName@.controller.tsx',
    content: `import React from "react";
    import @folderName(pascal-case)@View from "./@folderName@.view";
    import I@folderName(pascal-case)@Props from "./@folderName@.props";

    const @folderName(pascal-case)@: React.FC<I@folderName(pascal-case)@Props> = () => {
      return <@folderName(pascal-case)@View />;
    };

    export default @folderName(pascal-case)@;`
  },
  props: {
    name: '@folderName@.props.ts',
    content: `interface I@folderName(pascal-case)@Props {};

    export default I@folderName(pascal-case)@Props;`
  }
};

export default REACT;