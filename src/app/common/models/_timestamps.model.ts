import { IModel } from './index';

export enum TimestampFields {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

/**
 * Read Only Fields
 * attach to timestamped models.
 */
export const timestamps: {[key: string]: IModel} = {
  [TimestampFields.CREATED_AT]: {
    label: 'Created At',
    type: 'timestamp',
  },
  [TimestampFields.UPDATED_AT]: {
    label: 'Updated At',
    type: 'timestamp'
  }
};
