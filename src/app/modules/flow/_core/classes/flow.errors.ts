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

