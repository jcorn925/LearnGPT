


export default class SequenceGenerator {


  static generateSequence = () => {



    let query = `
      I want you to create  1 json objects that represents a path to explore advanced topics of computer science. Here is an
      example of such an object: ${JSON.stringify(exampleQuery)}. Note the property pathSuggestions. I want you to fill any tags that are [input] ,  with the correlated information along with new ideas with the new ideas you have in mind. I want you to limit the properties only to what i have provided in the example.


      example output in an array dont include indexes:
[
{ "sequence1": ${JSON.stringify(exampleQuery)}},

]

I only want the json data. do not give me any explanation of your response. be concise, no chit chat at all.


      `;

    return query;

  }



  static generateSequenceFromIdeas(idea: string) {


    if (!idea) return this.generateSequence();


    let query = `
      I want you to create  1 json objects that represents a path to explore advanced topics of ${idea}

      example output in an array dont include indexes:
      [
      { "sequence1": ${JSON.stringify(exampleQuery)}},
      ]

      Follow these rules when creating the json object:
      - fill any [input] tags with the correlated information along with new ideas with the new ideas you have in mind.
      - make sure the name is a name that represents the path you are creating.


      I only want the json data. do not give me any explanation of your response. be concise, no chit chat at all.

      `;

    console.log('%cqueryUsed', 'color: red; font-size: 24px', query);

    return query;

  }




}





const exampleQuery = {
  "sequence": {
    "id": "ca39996f",
    "name": "[input]",
    "parentId": "root",
    "description": "explore path [input]",
    "pathSuggestions": {
      "idea1": {
        "topicName": '[input]',
        "description": '[input]',
      },
      "idea2": {
        "topicName": '[input]',
        "description": '[input]',
      },
      "idea3": {
        "topicName": '[input]',
        "description": '[input]',
      }
    },

  },
}