import _ from 'lodash';

declare global {
  interface Object {
    id?: string | any;
    _id?: string | any;
  }
}

const omit = (obj: any, fields: string[]) => {
  return Object.keys(obj).reduce((object, field) => {
    // @ts-ignore
    if (!fields.includes(field)) object[field] = obj[field];

    return object;
  }, {});
};

function getInfoData(
  obj: Object,
  { fields = [], without = [] }: Partial<Record<'fields' | 'without', string[]>>
) {
  if (obj?._id) {
    obj.id = obj._id;

    delete obj._id;
  }

  const picked = _.isEmpty(fields) ? obj : _.pick(obj, fields!);
  return omit(picked, without);
}

const isNullish = (val: any) => (val ?? null) === null;

const removeNullishElements = (arr: Array<any>) => {
  const final: typeof arr = [];

  arr.forEach((ele) => {
    if (!isNullish(ele)) {
      const result = removeNestedNullish(ele);

      final[final.length] = result;
    }
  });

  return final.filter((ele) => !isNullish(ele) && ele);
};

const removeNullishAttributes = (obj: Object) => {
  const final: typeof obj = {};

  for (const key in obj) {
    // @ts-ignore
    if (!isNullish(obj[key])) {
      // @ts-ignore
      const result = removeNestedNullish(obj[key]);

      if (result instanceof Object && !Object.keys(result).length) return;

      // @ts-ignore
      final[key] = result;
    }
  }

  return final;
};

const removeNestedNullish = (any: any) => {
  if (any instanceof Array) return removeNullishElements(any as Array<any>);
  if (any instanceof Object) return removeNullishAttributes(any as Object);

  return any;
};

export { getInfoData, removeNestedNullish };
