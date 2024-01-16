import { v4 as uuidv4 } from 'uuid';

export default class SequenceAppState {
  accessType: string;
  payload: any;

  constructor() {
    this.accessType = 'sequenceAppState';
  }

  async saveAppState() {
    const appStateId = uuidv4();
    const appStateObject = {
      [appStateId]: this.payload,
    };

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessType], (result) => {
        let sequenceAppState = result[this.accessType] || {};
        sequenceAppState = { ...sequenceAppState, ...appStateObject };
        chrome.storage.local.set({ [this.accessType]: sequenceAppState }, () => {
          console.log(`Saved app state with ID |${appStateId}|`);
          resolve(appStateId);
        });
      });
    });
  }


  static clearAllAppStates() {
    const accessType = 'sequenceAppState';
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [accessType]: {} }, () => {
        console.log('Cleared all app states');
        resolve();
      });
    });
  }



  static saveAppState(payload: any) {
    const appStateId = uuidv4();
    const appStateObject = {
      [appStateId]: payload,
    };

    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['sequenceAppState'], (result) => {
        let sequenceAppState = result['sequenceAppState'] || {};
        sequenceAppState = { ...sequenceAppState, ...appStateObject };
        chrome.storage.local.set({ 'sequenceAppState': sequenceAppState }, () => {
          console.log(`Saved app state with ID |${appStateId}|`);
          resolve(appStateId);
        });
      });
    });
  }




  static getAppStateById(appStateId: string) {
    const accessType = 'sequenceAppState';

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        const appState = result[accessType] && result[accessType][appStateId];
        if (appState) {
          console.log(`Retrieved app state with ID |${appStateId}|`);
          resolve(appState);
        } else {
          console.log(`App state with ID |${appStateId}| not found`);
          reject(null);
        }
      });
    });
  }

  static getAllAppStates() {
    const accessType = 'sequenceAppState';

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        const appStates = result[accessType] || {};
        console.log('Retrieved all app states:', appStates);
        resolve(appStates);
      });
    });
  }

  static addTabState(appStateId: string, tabId: string, tabState: any) {
    const accessType = 'sequenceAppState';

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        let appState = result[accessType] && result[accessType][appStateId];

        if (!appState) {
          appState = {};
          result[accessType] = {
            ...result[accessType],
            [appStateId]: appState,
          };
          console.log(`Created new app state with ID |${appStateId}|`);
        }

        appState[tabId] = tabState;
        chrome.storage.local.set({ [accessType]: result[accessType] }, () => {
          console.log(`Added tab state with ID |${tabId}| to app state |${appStateId}|`);
          resolve(tabId);
        });
      });
    });
  }

  static modifyTabState(appStateId: string, tabId: string, updatedTabState: any) {
    const accessType = 'sequenceAppState';

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        const appState = result[accessType] && result[accessType][appStateId];

        if (appState && appState[tabId]) {
          appState[tabId] = updatedTabState;
          chrome.storage.local.set({ [accessType]: result[accessType] }, () => {
            console.log(`Modified tab state with ID |${tabId}| in app state |${appStateId}|`);
            resolve(tabId);
          });
        } else {

          console.log(`Tab state with ID | ${tabId}| in app state | ${appStateId}| not found`);
          reject(null);
        }
      });
    });
  }
  static deleteTabState(appStateId: string, tabId: string) {
    const accessType = 'sequenceAppState'; return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        const appState = result[accessType] && result[accessType][appStateId];

        if (appState && appState[tabId]) {
          delete appState[tabId];
          chrome.storage.local.set({ [accessType]: result[accessType] }, () => {
            console.log(`Deleted tab state with ID |${tabId}| from app state |${appStateId}|`);
            resolve(tabId);
          });
        } else {
          console.log(`Tab state with ID |${tabId}| in app state |${appStateId}| not found`);
          reject(null);
        }
      });
    });
  }





  static getMostRecentAppState() {
    const accessType = 'sequenceAppState';

    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        const appStates = result[accessType] || {};
        const appStateIds = Object.keys(appStates);

        if (appStateIds.length > 0) {
          const mostRecentAppStateId = appStateIds[appStateIds.length - 1];
          const mostRecentAppState = appStates[mostRecentAppStateId];
          console.log(`Retrieved most recent app state with ID |${mostRecentAppStateId}|`);
          resolve(mostRecentAppState);
        } else {
          console.log('No app states found');
          reject(null);
        }
      });
    });
  }




}