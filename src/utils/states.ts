import { ExtensionContext } from 'vscode';

function states(context: ExtensionContext) {
  return {
    get(key: string) {
      return context.workspaceState.get(key);
    },
    update(key: string, state?: string) {
      return context.workspaceState.update(key, state);
    },
    create(key: string, state?: string) {
      return this.update(key, state);
    },
  };
}

export default states;
