const isString = (x: any) => typeof x === 'string';
const isNumber = (x: any) => typeof x === 'number';
const isBoolean = (x: any) => typeof x === 'boolean';
const isSymbol = (x: any) => typeof x === 'symbol';
const isNull = (x: any) => x === null;
const isUndefined = (x: any) => typeof x === 'undefined';

type PrimitiveTypeString = 'string' | 'boolean' | 'number' | 'null' | 'undefined' | 'symbol';
type BasicObjectShape<K extends string> = {
  [KK in K]: PrimitiveTypeString;
};

interface RequiredOptionalObjectShape<K extends string> {
  required: BasicObjectShape<K>;
  optional: BasicObjectShape<K>;
}
