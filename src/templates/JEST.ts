const JEST = {
  extension: 'js',
  content: `import @fileName@ from "./@fileName@";

  describe("@fileName@ tests", ()=>{
    test("your tests", ()=>{});
    test("Wrong types", ()=>{});
  });
  `
};

export default JEST;
