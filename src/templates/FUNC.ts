const FUNC = {
  js: {
    content: `
    function @functionName@() {

    };

    export default @functionName@;
    `,
  },
  ts: {
    config: {
      createIndex: true,
      templateIndex: `export {};`,
    },
    content: `interface IProps {};

    function @functionName@(props: IProps) {
    };
    
    export default @functionName@;
    `,
  },
};

export default FUNC;
