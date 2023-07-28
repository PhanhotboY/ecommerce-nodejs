import _ from 'lodash';

export function getInfoData(fields: string[], obj: {}) {
  return _.pick(obj, fields);
}
