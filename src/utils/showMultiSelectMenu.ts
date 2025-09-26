import { IMultiSelectMenu } from 'types';
import { window } from 'vscode';

export async function showMultiSelectMenu(options: IMultiSelectMenu[]) {
  const selected = await window.showQuickPick(options, {
    canPickMany: true,
    title: 'Select Your Configuration Options',
    placeHolder: 'Select one or more features to enable',
  });

  return selected;
}
