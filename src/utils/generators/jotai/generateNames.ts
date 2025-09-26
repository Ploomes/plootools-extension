function generateNames(folderName: string, useAtomFamily: boolean) {
  const tag = useAtomFamily ? 'Family' : '';
  const atom = `@${folderName}(camel-case)@Atom${tag}`;
  const atomInterface = `I@${folderName}(pascal-case)@Atom${tag}`;
  const dispatch = `use@${folderName}(pascal-case)@Dispatch`;
  const state = `use@${folderName}(pascal-case)@State`;

  return { atom, atomInterface, dispatch, state };
}

export default generateNames;
