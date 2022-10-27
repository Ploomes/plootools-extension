import { commands, QuickPickItem, window } from "vscode";
import { config } from "../config";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "../types";
import createComponent from "./createComponent";
import createTests from "./createTests";

async function createMenu(props: ICallbackCommand) {
  const options: (QuickPickItem & { id: number })[] = [
    {
      label: '$(files) Create React Component',
      id: MENU_OPTIONS.CREATE_COMPONENT
    },
    {
      label: '$(tools) Create tests',
      id: MENU_OPTIONS.CREATE_TESTS
    }
  ]; 
  const action = await window.showQuickPick(options, {
    title: 'Select what you want to do'
  });

  if(action) {
    switch(action.id){
      case MENU_OPTIONS.CREATE_COMPONENT:
        const typeCreation = await window.showQuickPick([
          {
            label: '$(folder-opened) Folder and Files',
            id: MENU_OPTIONS.REACT_COMPONENT_FOLDER_AND_FILES
          },
          {
            label: '$(files) Files only',
            id: MENU_OPTIONS.REACT_COMPONENT_FILES_ONLY
          }
        ]);

        if(typeCreation) {
          await createComponent({...props, action: typeCreation.id});
        }else {
          window.showErrorMessage(`${config.displayName}: Operation Cancelled`);
        }

        break;
      default:
        await createTests(props);
        break;
    }
  }else {
    window.showErrorMessage(`${config.displayName}: Select an option`);
  }
}

export default createMenu;