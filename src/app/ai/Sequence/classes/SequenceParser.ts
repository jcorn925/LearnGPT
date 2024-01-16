type JSONStructure = {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  pathSuggestions: { [key: string]: string };
  sequencePaths: { [key: string]: JSONStructure };
};

export default class SequenceParser {
  private jsonString: string;

  constructor(jsonString: string) {
    this.jsonString = jsonString;
  }

  public parse(): JSONStructure | null {
    try {
      // Remove newlines and extra spaces
      this.jsonString = this.jsonString.replace(/\n/g, '').trim();

      // Fix missing/extra commas
      this.fixCommas();

      // Fix incorrect key names
      this.fixKeyNames();

      // Parse JSON string
      const parsedJSON = JSON.parse(this.jsonString);

      return parsedJSON.sequence;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return null;
    }
  }

  private fixCommas(): void {
    const regex = /}(\s*){/g;
    this.jsonString = this.jsonString.replace(regex, '}, {');
  }

  private fixKeyNames(): void {
    const keyMapping: { [key: string]: string } = {
      'sequenceid': 'id',
      'sequenceId': 'id',
      'sequence_name': 'name',
      'sequenceName': 'name',
      'parent_id': 'parentId',
      'parentId': 'parentId',
      'sequence_description': 'description',
      'sequenceDescription': 'description',
      'path_suggestions': 'pathSuggestions',
      'pathSuggestions': 'pathSuggestions',
      'sequence_paths': 'sequencePaths',
      'sequencePaths': 'sequencePaths',
    };

    for (const incorrectKey of Object.keys(keyMapping)) {
      const correctKey = keyMapping[incorrectKey];
      const regex = new RegExp(`"${incorrectKey}"`, 'g');
      this.jsonString = this.jsonString.replace(regex, `"${correctKey}"`);
    }
  }
}
