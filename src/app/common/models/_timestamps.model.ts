import { IModel } from './index';

/**
 * Read Only Fields
 * attach to timestamped models.
 */
export const timestamps: {[key: string]: IModel} = {
  createdAt: {
    label: 'Created At',
    type: 'timestamp',
  },
  updatedAt: {
    label: 'Updated At',
    type: 'timestamp'
  }
};
