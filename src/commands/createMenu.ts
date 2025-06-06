import { ExtensionContext, QuickPickItem, window } from "vscode";
import { MENU_OPTIONS, MENU_OPTIONS_DISPLAY } from "../constants";
import { ICallbackCommand } from "../types";
import { isValidFileName, showMessage, showMultiSelectMenu } from "../utils";
import createComponent from "./createComponent";
import createFuncAndTest from "./createFuncAndTest";
import createTests from "./createTests";
import createRecoilStateManager from "./createRecoilStateManager";
import createJotaiStateManager from "./createJotaiStateManager";
import insertIcons from "./insertIcons";

async function createMenu(this: ExtensionContext, props: ICallbackCommand) {
  const context = this;
  if(context) props = {...props, context};
  
  const options = MENU_OPTIONS_DISPLAY; 
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
            await createComponent({...props, action: typeCreation.id });
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
            extensionName: extensionName.id as string,
            fileName: funcName
          });
          break;
        case MENU_OPTIONS.CREATE_RECOIL_STATE:
          const typeCreationState = await window.showQuickPick([
            {
              label: '$(folder-opened) Folder and Files',
              id: MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES
            },
            {
              label: '$(files) Files only',
              id: MENU_OPTIONS.RECOIL_STATE_FOLDER_AND_FILES_ONLY
            }
          ]);
          if(typeCreationState) {
            await createRecoilStateManager({...props, action: typeCreationState.id });
          }else {
            showMessage.error('Operation Cancelled');
          }
        break;
        case MENU_OPTIONS.CREATE_JOTAI_STATE:
          const typeCreationJotai = await window.showQuickPick([
            {
              label: '$(folder-opened) Folder and Files',
              id: MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES
            },
            {
              label: '$(files) Files only',
              id: MENU_OPTIONS.JOTAI_STATE_FOLDER_AND_FILES_ONLY
            }
          ]);
          if(typeCreationJotai) {
             const selectedMultiOptions = await showMultiSelectMenu([
              {
                id: MENU_OPTIONS.JOTAI_STATE_WITH_ATOM_FAMILY,
                label: '$(symbol-structure) Use atomFamily',
                description: 'Generate a family of atoms',
              },
                {
                id: MENU_OPTIONS.JOTAI_STATE_WITH_RESET,
                label: '$(history) Resettable (atomWithReset)',
                description: 'Enable reset behavior with atomWithReset',
              }
            ]);

            await createJotaiStateManager({...props, action: typeCreationJotai.id, selectedMultiOptions });
          }else {
            showMessage.error('Operation Cancelled');
          }
          break;
        case MENU_OPTIONS.INSERT_ICONS:
          const iconName = await window.showInputBox({
            title: 'Icon name'
          });
          if(!iconName) throw new Error();

          insertIcons({
            ...props,
            iconName
          });
          break;
        case MENU_OPTIONS.CREATE_TESTS:
          await createTests(props);
          break;
        default:
          throw new Error('Select an option!');
      }
    } catch {
      showMessage.error('Select an option!');
    }
  }else {
    showMessage.error('Select an option!');
  }
}

export default createMenu;