import { startCase, toLower } from 'lodash';

function toPascalCase(name: string) {
  return startCase(toLower(name)).split(/\s/).join('');
}

export default toPascalCase;
