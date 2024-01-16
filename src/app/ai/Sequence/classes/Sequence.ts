import TemplateExample from "../../CustomBlock/context/classes/fragments/example";
const ext2 = {
  "id": "sequence_image_recognition",
  "name": "Image Recognition",
  "description": "Identify objects in the provided image.",
  "inputVar": "image",
  "functionality": "objectRecognition",
  "outputVar": "objects",
  "errorHandling": {
    "strategy": "continue",
    "fallbackOutput": "[]"
  },
  "timeout": 5000,
  "retryCount": 3,
  "retryDelay": 1000,
  "onStart": "sequence_before_image_recognition",
  "onSuccess": "sequence_after_image_recognition",
  "onFailure": "sequence_handle_image_recognition_failure",

  "currentProgress": 0,

}


class Sequence {
  private id: string;
  private name: string;
  private description: string;
  private inputVar: string;
  private functionality: string;
  private outputVar: string;
  private currentProgress: number;
  private parentId: string;
  private outputHistory: { [key: string]: any };
  private pathSuggestions: { [key: string]: any };
  private sequencePaths: { [key: string]: any };
  templates: { [key: string]: any };


  constructor(sequenceData: Partial<Sequence>) {
    this.id = sequenceData.id || '';
    this.name = sequenceData.name || '';
    this.parentId = sequenceData.parentId; // Initialize the parentId property
    this.description = sequenceData.description || '';
    this.inputVar = sequenceData.inputVar || '';
    this.functionality = sequenceData.functionality || '';
    this.outputVar = sequenceData.outputVar || '';
    this.outputHistory = sequenceData.outputHistory || {};
    this.pathSuggestions = sequenceData.pathSuggestions || {};
    this.currentProgress = sequenceData.currentProgress || 0;
    this.sequencePaths = {}
    this.templates = sequenceData.templates || {};
  }

  // Getter and setter methods for each property

  async execute(input: number): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // console.log(`Sequence ${this.name} executed successfully`);
        // console.log(`Input: ${input}`);
        // console.log('wo');
        resolve(input);
      }, 1000);
    });
  }


  addTemplate(template: Template,) {
    console.log('%ctemplate', 'color: lightblue; font-size: 14px', template);
    this.templates[template.templateName] = template;
    console.log('%cthis.templates', 'color: lightblue; font-size: 14px', this.templates);
  }

  addSequencePath(sequencePath: SequencePath) {
    this.sequencePaths[sequencePath.getId()] = sequencePath;
  }






  setOutputVar(outputVar: string): void {
    if (!outputVar ) return;
    this.outputVar = outputVar;
    console.log(this);
  }


  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }


  getParentId(): string | null {
    return this.parentId;
  }

  setParentId(parentId: string): void {
    this.parentId = parentId;
  }

  setName(name: string): void {
    this.name = name;
  }

  getDescription(): string {
    return this.description;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  getInputVar(): string {
    return this.inputVar;
  }

  setInputVar(inputVar: string): void {
    this.inputVar = inputVar;
  }

  getFunctionality(): string {
    return this.functionality;
  }

  setFunctionality(functionality: string): void {
    this.functionality = functionality;
  }

  getOutputVar(): string {
    return this.outputVar;
  }


  getCurrentProgress(): number {
    return this.currentProgress;
  }

  setCurrentProgress(currentProgress: number): void {
    this.currentProgress = currentProgress;
  }
}


export default Sequence;


export class InputProcess {

  static inputs = new Map();


  static async getInputFromUser(sequenceName, sequenceId) {
    return new Promise((resolve) => {
      if (!this.inputs.has(sequenceId)) {
        const input = prompt(`Enter input for sequence: ${sequenceName}`);
        this.inputs.set(sequenceId, input);
      }
      resolve(this.inputs.get(sequenceId));
    });
  }


  static printInputs() {
    console.log(this.inputs);
  }

}