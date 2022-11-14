import { QuickPickItem, window } from "vscode";
import { MENU_OPTIONS } from "../constants";
import { ICallbackCommand } from "../types";
import { isValidFileName, showMessage } from "../utils";
import createComponent from "./createComponent";
import createFuncAndTest from "./createFuncAndTest";
import createTests from "./createTests";

async function createMenu(props: ICallbackCommand) {
  const options: (QuickPickItem & { id: number | string })[] = [
    {
      label: '$(files) Create React Component',
      id: MENU_OPTIONS.CREATE_COMPONENT
    },
    {
      label: '$(tools) Create tests',
      id: MENU_OPTIONS.CREATE_TESTS
    },
    {
      label: '$(code) Create function and test',
      id: MENU_OPTIONS.CREATE_FUNC_TEST
    }
  ]; 
  const action = await window.showQuickPick(options, {
    title: 'Select what you want to do'
  });

  if(action) {
    try {
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
            showMessage.error('Operation Cancelled');
          }
          break;
        case MENU_OPTIONS.CREATE_FUNC_TEST:
          const funcName = await window.showInputBox({
            title: 'Function name'
          });
  
          if(!funcName) {
            throw new Error();
          };

          if(!isValidFileName(funcName)) {
            return showMessage.error('File name with invalid format!');
          }
  
          const extensionName = await window.showQuickPick([
            {
              label: '$(chevron-right) TS',
              id: MENU_OPTIONS.CREATE_FUNC_EXT_TS
            },
            {
              label: '$(chevron-right) JS',
              id: MENU_OPTIONS.CREATE_FUNC_EXT_JS
            }
          ], {
            title: 'Select the extension of the file you want to create'
          });

          if(!extensionName) {
            throw new Error();
          };
          await createFuncAndTest({
            ...props,
            action: action.id, 
            extensionName: extensionName.id,
            fileName: funcName
          });
          break;
        default:
          await createTests(props);
          break;
      }
    } catch {
      showMessage.error('Select an option!');
    }
  }else {
    showMessage.error('Select an option!');
  }
}

export default createMenu;