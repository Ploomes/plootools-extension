const JEST = {
  extension: 'js',
  content: `import @fileName@ from "./@fileName@";

  describe("@fileName@ tests", ()=>{
    test("Lorem ipsum", ()=>{
      expect(@fileName@()).toEqual();
    });
  });
  `
};

export default JEST;
