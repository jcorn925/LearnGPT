import { useCallback } from 'react';
import MessageFactory from '@src/Utils/MessageFactory';


function useStatusBarActions() {
  const activateLiveColorPicker = () => {
    console.log('yo');
    MessageFactory.CreateMessage('message', 'activateLiveColorPicker');
  };

  // const resizePopupWindow = (newWidth, newHeight) => {
  //   chrome.windows.getAll(function (windows) {
  //     for (var i = 0; i < windows.length; i++) {
  //       if (windows[i].type === 'popup') {
  //         chrome.windows.update(windows[i].id, { width: newWidth, height: newHeight });
  //       }
  //     }
  //   });
  // };

  // function movePopupWindow(x, y) {
  //   chrome.windows.getAll(function (windows) {
  //     for (var i = 0; i < windows.length; i++) {
  //       if (windows[i].type === "popup") {
  //         chrome.windows.update(windows[i].id, { left: x, top: y });
  //       }
  //     }
  //   });
  // }



  // const openOptionsPage = useCallback(() => {
  //   Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' });
  // }, []);

  return { activateLiveColorPicker, resizePopupWindow, openOptionsPage };
}


export default useStatusBarActions;