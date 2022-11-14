const FUNC = {
  js: {
    content: `
    function @functionName@() {

    };

    export default @functionName@;
    `
  },
  ts: {
    content: `interface IProps {};

    function @functionName@(props: IProps) {
    };
    
    export default @functionName@;
    `
  }
};

export default FUNC;