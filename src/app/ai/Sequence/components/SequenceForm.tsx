import React, { useState, useEffect } from 'react';



const SequenceForm = ({ sequence, onUpdate }) => {
  const [currentSequence, setCurrentSequence] = useState(sequence);

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    inputVar: '',
    functionality: '',
    outputVar: '',
    timeout: 0,
    retryCount: 0,
    retryDelay: 0,
    onStart: '',
    onSuccess: '',
    onFailure: '',
    currentProgress: 0,
  });


  useEffect(() => {
    setCurrentSequence(sequence);
  }, [sequence]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case 'id':
        currentSequence.setId(value);
        setFormState({ ...formState, id: value });

        break;
      case 'name':
        currentSequence.setName(value);
        setFormState({ ...formState, id: value });
        break;
      case 'description':
        currentSequence.setDescription(value);
        setFormState({ ...formState, id: value });
        break;
      case 'inputVar':
        currentSequence.setInputVar(value);
        setFormState({ ...formState, id: value });
        break;
      case 'functionality':
        currentSequence.setFunctionality(value);
        setFormState({ ...formState, id: value });
        break;
      case 'outputVar':
        currentSequence.setOutputVar(value);
        setFormState({ ...formState, id: value });
        break;
      case 'timeout':
        currentSequence.setTimeout(parseInt(value, 10));
        setFormState({ ...formState, id: value });
        break;
      case 'retryCount':
        currentSequence.setRetryCount(parseInt(value, 10));
        setFormState({ ...formState, id: value });
        break;
      case 'retryDelay':
        setFormState({ ...formState, id: value });
        currentSequence.setRetryDelay(parseInt(value, 10));
        break;
      case 'onStart':
        setFormState({ ...formState, id: value });
        currentSequence.setOnStart(value);
        break;
      case 'onSuccess':
        currentSequence.setOnSuccess(value);
        setFormState({ ...formState, id: value });
        break;
      case 'onFailure':
        currentSequence.setOnFailure(value);
        setFormState({ ...formState, id: value });
        break;
      case 'currentProgress':
        currentSequence.setCurrentProgress(parseFloat(value));
        setFormState({ ...formState, id: value });
        break;
      default:
        break;
    }
    setCurrentSequence(currentSequence);
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate(currentSequence);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={currentSequence.getDescription()}
          onChange={handleChange}
        />
      </label>
      <label>
        Input Variable:
        <input
          type="text"
          name="inputVar"
          value={currentSequence.getInputVar()}
          onChange={handleChange}
        />
      </label>

      <label>
        Functionality:
        <input
          type="text"
          name="functionality"
          value={currentSequence.getFunctionality()}
          onChange={handleChange}
        />
      </label>

      <label>
        Output Variable:
        <input
          type="text"
          name="outputVar"
          value={currentSequence.getOutputVar()}
          onChange={handleChange}
        />
      </label>

      <label>
        Timeout:
        <input
          type="number"
          name="timeout"
          value={currentSequence.getTimeout()}
          onChange={handleChange}
        />
      </label>

      <label>
        Retry Count:
        <input
          type="number"
          name="retryCount"
          value={currentSequence.getRetryCount()}
          onChange={handleChange}
        />
      </label>

      <label>
        Retry Delay:
        <input
          type="number"
          name="retryDelay"
          value={currentSequence.getRetryDelay()}
          onChange={handleChange}
        />
      </label>

      <label>
        On Start:
        <input
          type="text"
          name="onStart"
          value={currentSequence.getOnStart()}
          onChange={handleChange}
        />
      </label>

      <label>
        On Success:
        <input
          type="text"
          name="onSuccess"
          value={currentSequence.getOnSuccess()}
          onChange={handleChange}
        />
      </label>




      {/* Add more input fields for other properties */}
      <button type="submit">Save</button>
    </form>
  );
};

export default SequenceForm;
