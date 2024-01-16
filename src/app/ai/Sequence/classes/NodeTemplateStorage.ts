import LZString from 'lz-string';
// shape of local storage
// {
//   "template": {
//    "asd": {
//      "queryName": "asd",
//      "bubbleColor": "blue",
//      "conversationStyle": "conversational",
//      "responseLength": 99,
//      "markDownTemplate": "tell me something funny "
//    },
//    "nextkey": {}
//  },
//  "chat": {
//    "asd": {
//      "queryName": "asd",
//      "bubbleColor": "blue",
//      "conversationStyle": "conversational",
//      "responseLength": 99,
//      "markDownTemplate": "tell me something funny "
//    },
//   nextkey": {}
//  }
// }




export default class NodeTemplateStorage {
  itemKey: string;
  accessId: string;
  payload: any;

  constructor(itemKey: string, accessId: string, payload: any) {
    this.itemKey = itemKey;
    this.payload = payload;
    this.accessId = '';


    console.log(this.payload, 'payload');

    this.checkKeyInit().then(() => {
      this.accessId = accessId;
    });

    // this.clearLocalStorage().then((result) => {
    //   console.log(result, 'clearLocalStorage');
    // });


  }


  static async addNodeAnalysis(nodeAnalysis: any) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ nodeAnalysis }, () => {
        console.log('nodeAnalysis saved');
        resolve('saved');
      });
    });
  }



  static async getWebsiteData() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['websiteData'], (result) => {
        console.log('websiteData:', result);
        resolve(result);
      }
      );
    });
  }


  static async getNodeAnalysis() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['nodeAnalysis'], (result) => {
        console.log('nodeAnalysis:', result);
        resolve(result);
      }
      );
    });
  }


  clearLocalStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        console.log('Chrome local storage cleared.');
        resolve('cleared');
      });
    });
  }


  static clearLocalStorage() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        console.log('Chrome local storage cleared.');
        resolve('cleared');
      });
    });
  }


  static printAllStorageItems() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, (result) => {
        console.log('All storage items:', result);
        resolve(result);
      }
      );
    });
  }

  static getLastLiveCss() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['lastLiveCss'], (result) => {
        console.log('lastLiveCss:', result);
        resolve(result);
      }
      );
    });
  }

  static setLastLiveCss(css: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ lastLiveCss: css }, () => {
        console.log(`Added |lastLiveCss| with access type |lastLiveCss| in storage with value |${css}|`);
        resolve('success');
      });
    });
  }




  //This function adds a new key to the storage. If the key already exists, it returns a message saying so. The function uses the variable accessType to determine the storage it will write to.

  async addStorageItem() {
    this.checkIfStorageItemExists().then((exists) => {
      if (exists) {
        return "Item already exists";
      } else {

        switch (this.accessId) {
          case 'template':
            return new Promise((resolve, reject) => {
              chrome.storage.local.get([this.accessId], (result) => {
                let template = result[this.accessId];
                template = { ...template, [this.itemKey]: this.payload };
                chrome.storage.local.set({ [this.accessId]: template }, () => {
                  console.log(`Added |${this.itemKey}| with access type |${this.accessId}| in storage with value |${this.payload}|`);
                  resolve('success');
                });
                console.log('template', template);
              });
            });

          case 'webflowComponent':
            return new Promise((resolve, reject) => {
              chrome.storage.local.get([this.accessId], (result) => {
                let webflowComponent = result[this.accessId];

                // Compress component data
                const compressedComponentData = LZString.compress(JSON.stringify(this.payload.componentData));

                // Update the payload with the compressed data
                const updatedPayload = { ...this.payload, componentData: compressedComponentData };

                webflowComponent = { ...webflowComponent, [this.itemKey]: updatedPayload };
                chrome.storage.local.set({ [this.accessId]: webflowComponent }, () => {
                  console.log(`Added |${this.itemKey}| with access type |${this.accessId}| in storage with value |${updatedPayload}|`);
                  resolve('success');
                });
                console.log('webflowComponent', webflowComponent);
              });
            });


          case 'chat':
            return new Promise((resolve, reject) => {
              chrome.storage.local.get([this.accessId], (result) => {
                let chat = result[this.accessId];
                chat = { ...chat, [this.itemKey]: this.payload };
                chrome.storage.local.set({ [this.accessId]: chat }, () => {
                  console.log(`Added |${this.itemKey}| with access type |${this.accessId}| in storage with value |${this.payload}|`);
                  resolve('success');
                });
              });
            });

          case 'modelSelected':
            return new Promise((resolve, reject) => {
              chrome.storage.local.set({ [this.accessId]: this.payload }, () => {
                console.log(`Added |${this.accessId}| in storage with value |${this.payload}|`);
                resolve('success');
              });
            });

          default:
            return new Promise((resolve, reject) => {
              chrome.storage.local.get([this.accessId], (result) => {
                let template = result[this.accessId];
                template = { ...template, [this.itemKey]: this.payload };
                chrome.storage.local.set({ [this.accessId]: template }, () => {
                  console.log(`Added |${this.itemKey}| with access type |${this.accessId}| in storage with value |${this.payload}|`);
                  resolve('success');
                });
              });
            });
        }
      }
    });
  }


  static addBatchTemplateItems(payload: any) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['template'], (result) => {
        let template = result['template'] || {};

        Object.keys(payload).forEach((queryName) => {
          template[queryName] = {
            ...template[queryName],
            ...payload[queryName],
          };
        });
        chrome.storage.local.set({ 'template': template }, () => {
          console.log(`Added ${Object.keys(payload).length} items with access type 'template' in storage`);
          resolve('success');
        });
      });
    });
  }




  changeStorageItemName(newName: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessId], (result) => {
        let item = result[this.accessId][this.itemKey];
        delete result[this.accessId][this.itemKey];
        result[this.accessId] = { ...result[this.accessId], [newName]: item };
        chrome.storage.local.set({ [this.accessId]: result[this.accessId] }, () => {
          console.log(`Changed |${this.itemKey}| to |${newName}|`);
          resolve('success');
        });
      });
    });
  }

  deleteStorageItem(itemKey: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessId], (result) => {
        delete result[this.accessId][itemKey];
        chrome.storage.local.set({ [this.accessId]: result[this.accessId] }, () => {
          console.log(`Deleted |${itemKey}|`);
          resolve('success');
        });
      });
    });
  }


  static deleteStorageItemByAccessType(itemKey: string, accessType: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        delete result[accessType][itemKey];
        chrome.storage.local.set({ [accessType]: result[accessType] }, () => {
          console.log(`Deleted |${itemKey}|`);
          resolve('success');
        });
      });
    });
  }




  // check for chrome storage update
  static watchForStorageUpdate() {
    return new Promise((resolve, reject) => {
      chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
          // console.log(
          //   `Storage key "${key}" in namespace "${namespace}" changed.`,
          //   `Old value was "${oldValue}", new value is "${newValue}".`
          // );
          resolve('updated');
        }
      });
    });
  }

  getStorageItem(itemKey: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessId], function (result) {
        resolve(result[itemKey]);
      });
    }
    );
  }


  static getStorageItemByAccessType(itemKey: string, accessType: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(accessType, function (result) {
        if (accessType === 'webflowComponent') {
          // Decompress the payload before returning
          const decompressedPayload = JSON.parse(LZString.decompress(result[accessType][itemKey]));
          resolve(decompressedPayload);
        } else {
          resolve(result[accessType][itemKey]);
        }
      });
    });
  }

  static async getSelectedModel() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('modelSelected', function (result) {
        resolve(result['modelSelected']);
      });
    }
    );
  }


  static getAllComponents(accessType = 'webflowComponent') {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          const components = result[accessType];
          console.log(`Retrieved all components with access type |${accessType}|:`, components);
          resolve(components);
        }
      });
    });
  }

  async checkIfComponentWithNameExists(componentName, accessType = 'webflowComponent') {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          const components = result[accessType];
          const componentNames = Object.keys(components);

          const nameExists = componentNames.some((name) => name === componentName);
          console.log(`Component with name "${componentName}" exists:`, nameExists);
          resolve(nameExists);
        }
      });
    });
  }




  static changeTemplateActiveProperty(itemKey: string, activeStatus: string, accessType: string) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([accessType], (result) => {

        let template = result[accessType][itemKey];


        console.log('%ctemplateSettingActive', 'color: red; font-size: 14px', template);

        console.log(template, 'tttttttttttttttttttttt');

        template.active = activeStatus;


        //toggle active property

        // template.active = !template.active;


        console.log('template', template);

        result[accessType][itemKey] = template;
        chrome.storage.local.set({ [accessType]: result[accessType] }, () => {
          console.log(`Changed active property of template |${itemKey}| to |${template.active}|`);
          resolve('success');
        });
      });
    });
  }


  //get all storage items
  static getAllStorageItems() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, function (result) {
        resolve(result);
      });
    }
    );
  }

  //get all storage items by access type
  static getAllStorageItemsByAccessType(accessType: string) {
    1
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(accessType, function (result) {
        resolve(result[accessType]);
      });
    }
    );
  }

  // checks if the keys for the specified access type exist in storage. If not, it creates them.
  checkKeyInit() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessId], (result) => {
        if (result === undefined || result === null) {
          console.log('key not initialized');
          chrome.storage.local.set({ [this.accessId]: {} }, () => {
            console.log('key initialized');
            resolve('success');
          });
        } else {
          resolve('success');
        }
      });
    });
  }


  checkIfStorageItemExists() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([this.accessId], (result) => {
        if (!result || !result[this.accessId] || result[this.accessId][this.itemKey] === undefined) {
          console.log('item does not exist');
          resolve(false);
        } else {
          console.log('item exists');
          resolve(true);
        }
      });
    });
  }


}