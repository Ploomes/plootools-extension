import { MessageOptions, window } from 'vscode';
import { config } from '../config';

const showMessage = {
  error: (message: string, options?: MessageOptions) => {
    return window.showErrorMessage(`${config.displayName}: ${message}`, options || {});
  },
  info: (message: string, options?: MessageOptions) => {
    return window.showInformationMessage(`${config.displayName}: ${message}`, options || {});
  },
  warn: (message: string, options?: MessageOptions) => {
    return window.showWarningMessage(`${config.displayName}: ${message}`, options || {});
  },
};

export default showMessage;
