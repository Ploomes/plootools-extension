function toPascalCase(name: string) {
  let formatName = name.charAt(0).toUpperCase() + name.slice(1);
  formatName = formatName.replace(/\-\w/g, (match) => {
    return match.replace(/\-/g, "").toUpperCase();
  });

  return formatName;
}

export default toPascalCase;
