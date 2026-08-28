import { window } from 'vscode';
import buildTemplate from './buildTemplate';

interface ITemplateFile {
  name: string;
  [key: string]: unknown;
}

interface ISelectFilesToCreateResult<TKey extends string> {
  /** `undefined` means the user cancelled the picker (Esc) — abort the whole operation. */
  selectedKeys: TKey[] | undefined;
}

/**
 * Shows a multi-select QuickPick with every file of the given template, all pre-selected,
 * so the user can uncheck the ones they don't want created.
 */
async function selectFilesToCreate<TKey extends string>(
  templates: Record<TKey, ITemplateFile>,
  folderName: string,
): Promise<ISelectFilesToCreateResult<TKey>> {
  const keys = Object.keys(templates) as TKey[];

  const items = await Promise.all(
    keys.map(async (key) => {
      const { fileName } = await buildTemplate({
        folderName,
        fileName: templates[key].name,
        template: '',
        prettier: { active: false },
      });
      return { key, label: fileName, picked: true };
    }),
  );

  const selected = await window.showQuickPick(items, {
    canPickMany: true,
    title: 'Select the files you want to create',
    placeHolder: 'All files are selected by default — uncheck the ones you do not need',
  });

  return { selectedKeys: selected?.map((item) => item.key) };
}

export default selectFilesToCreate;
