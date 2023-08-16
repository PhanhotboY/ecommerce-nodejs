import _ from 'lodash';

declare global {
  interface Object {
    id?: string | any;
    _id?: string | any;
  }
}

const omit = (obj: Partial<Object>, fields: string[]) => {
  return (Object.keys(obj) as Array<keyof typeof obj>).reduce((object, field) => {
    if (!fields.includes(field)) object[field] = obj[field];

    return object;
  }, {});
};

function getInfoData(
  obj: Object,
  { fields = [], without = [] }: Partial<Record<'fields' | 'without', string[]>>
): Object {
  if (Array.isArray(obj)) return obj.map((ele) => getInfoData(ele, {}));
  if (obj?._id) {
    obj.id = obj._id;

    delete obj._id;
  }

  const picked = _.isEmpty(fields) ? obj : _.pick(obj, fields!);
  return omit(picked, without);
}

const isNullish = (val: any) => (val ?? null) === null;
const isEmptyObj = (obj: Object) => !Object.keys(obj).length;
const getSkipNumber = (limit: number, page: number) => limit * page;
const isObj = (obj: any) => obj instanceof Object && !Array.isArray(obj);
const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const removeNullishElements = (arr: Array<any>) => {
  const final: typeof arr = [];

  arr.forEach((ele) => {
    if (!isNullish(ele)) {
      const result = removeNestedNullish(ele);
      if (result instanceof Object && isEmptyObj(result)) return;

      final[final.length] = result;
    }
  });

  return final.filter((ele) => !isNullish(ele) && ele);
};

const removeNullishAttributes = (obj: Object) => {
  const final: typeof obj = {};

  (Object.keys(obj) as Array<keyof typeof obj>).forEach((key) => {
    if (!isNullish(obj[key])) {
      const result = removeNestedNullish(obj[key]);

      if (result instanceof Object && isEmptyObj(result)) return;

      final[key] = result;
    }
  });

  return final;
};

const removeNestedNullish = <T>(any: any): T => {
  if (any instanceof Array) return removeNullishElements(any as Array<any>) as T;
  if (any instanceof Object) return removeNullishAttributes(any as Object) as T;

  return any;
};

function flattenObj(obj: Object, parent?: string, res: { [key: string]: any } = {}) {
  (Object.keys(obj) as Array<keyof typeof obj>).forEach((key) => {
    let propName = parent ? parent + '.' + key : key;
    if (isObj(obj[key])) {
      flattenObj(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  });

  return res;
}

export { getInfoData, removeNestedNullish, flattenObj, capitalizeFirstLetter, getSkipNumber };
