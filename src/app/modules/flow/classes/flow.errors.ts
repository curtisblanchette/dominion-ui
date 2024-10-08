class FlowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FlowError";
  }
}

/**
 * The next/prev step could not be determined
 */
export class NoStepFoundError extends FlowError {
  constructor(stepId?: string) {
    super(`The next/prev step could not be determined${stepId && ' from ' +  stepId || '' }.`);
    this.name = 'NoStepFoundError';
  }
}

export class ProcessNotFoundError extends FlowError {
  constructor(processId?: string) {
    super(`A process with id '${processId}' could not be found.`);
    this.name = 'ProcessNotFoundError';
  }
}

export class FormInvalidError extends FlowError {
  constructor(formName?: string) {
    super(`A form with the name '${formName}' is invalid.`);
    this.name = 'FormInvalidError';
  }
}
