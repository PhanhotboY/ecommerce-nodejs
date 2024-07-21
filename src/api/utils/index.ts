import { randomBytes } from 'crypto';
import _ from 'lodash';
import slugify from 'slugify';

declare global {
  interface Object {
    id?: string | any;
    _id?: string | any;
  }
}

const omit = <T = Object>(obj: T, fields?: string[]): Partial<T> => {
  if (!fields || !fields.length) return obj;

  return (Object.keys(obj as Object) as Array<keyof typeof obj>).reduce<
    Partial<T>
  >((object, field) => {
    if (!fields.includes(field as string)) object[field] = obj[field];

    return object;
  }, {});
};

function getReturnData<T = Object>(
  obj: T,
  options?: Partial<Record<'fields' | 'without', string[]>>
) {
  if (!obj) return obj;

  // @ts-ignore
  if (obj.toObject) obj = obj.toObject();

  if (obj?._id) {
    obj.id = obj._id;

    delete obj._id;
  }

  const picked = _.isEmpty(options?.fields || [])
    ? obj
    : _.pick(obj, options?.fields!);
  return omit(picked, [...(options?.without || []), '__v']) as Partial<
    typeof obj
  >;
}

function getReturnList<T = Array<any>>(
  arr: T[],
  options?: Partial<Record<'fields' | 'without', string[]>>
) {
  if (!arr.length) return arr;

  return arr.map((ele) => getReturnData(ele, options));
}

const isNullish = (val: any) => (val ?? null) === null;
const isEmptyObj = (obj: Object) => !Object.keys(obj).length;
const getSkipNumber = (limit: number, page: number) => limit * (page - 1);
const isObj = (obj: any) => obj instanceof Object && !Array.isArray(obj);
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

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
  if (any instanceof Array)
    return removeNullishElements(any as Array<any>) as T;
  if (any instanceof Object) return removeNullishAttributes(any as Object) as T;

  return any;
};

function flattenObj(
  obj: Object,
  parent?: string,
  res: { [key: string]: any } = {}
) {
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

function formatAttributeName<T extends Object = Object>(attrs: T, prefix = '') {
  const attributes = (Object.keys(attrs) as Array<keyof typeof attrs>).reduce(
    (acc, key) => {
      return Object.assign(acc, {
        [`${key === 'id' || key === '_id' ? '' : prefix}${key as string}`]:
          attrs[key],
      });
    },
    {}
  ) as T;

  return attributes;
}

function getSlug(str: string) {
  return slugify(
    str.split(' ').reduce((acc, cur) => acc + cur.slice(0, 1), '') +
      ' ' +
      randomBytes(4).toString('hex'),
    { lower: true }
  );
}

export {
  getSlug,
  isNullish,
  flattenObj,
  isEmptyObj,
  getReturnData,
  getReturnList,
  getSkipNumber,
  formatAttributeName,
  removeNestedNullish,
  capitalizeFirstLetter,
};
