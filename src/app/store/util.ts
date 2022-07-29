import { FlowLink, FlowRouter, FlowStep } from '../modules/flow';
import { get } from 'lodash';

export const getInitialStateByKey = (key: string): any | (FlowStep|FlowRouter|FlowLink)[] | undefined => {
  let state = localStorage.getItem('state') || '';
  // Lodash _.get enables dot.notation objects
  return get(state, key);
}
