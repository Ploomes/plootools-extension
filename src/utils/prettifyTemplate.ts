import { format, type Options } from 'prettier';

function prettifyTemplate(template: string, options?: Options) {
  return format(template, {
    semi: true,
    trailingComma: 'all',
    tabWidth: 2,
    singleQuote: true,
    bracketSpacing: true,
    ...options,
  });
}

export default prettifyTemplate;
