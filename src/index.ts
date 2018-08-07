import { RequiredProps } from '@mike-north/types';

export type BasicPropPredicate<T, K extends keyof T> =
  | RegExp
  | ((val: T[K]) => boolean)
  | T[K];

export interface NumberPropPredicateBase {
  gt: number;
  lt: number;
  gte: number;
  lte: number;
}
export type NumberPropPredicateGt = RequiredProps<Partial<NumberPropPredicateBase>, 'gt'>;
export type NumberPropPredicateGte = RequiredProps<Partial<NumberPropPredicateBase>, 'gte'>;
export type NumberPropPredicateLt = RequiredProps<Partial<NumberPropPredicateBase>, 'lt'>;
export type NumberPropPredicateLte = RequiredProps<Partial<NumberPropPredicateBase>, 'lte'>;

export type NumberPropPredicate =
  | NumberPropPredicateGt
  | NumberPropPredicateGte
  | NumberPropPredicateLt
  | NumberPropPredicateLte;

export type PropPredicate<T, K extends keyof T> = T[K] extends (number | undefined)
  ? NumberPropPredicate | BasicPropPredicate<T, K>
  : BasicPropPredicate<T, K>;

export type PredicateObject<T> = { [K in keyof T]: PropPredicate<T, K> };

interface ValidateObjectShapeOptions<K extends string> {
  allowedProperties: K[];
  propertyTypes: {
    [L in K]: 'string' | 'number' | 'boolean' | 'null' | 'undefined'
  };
}

function validateObjectShape<K extends string>(
  o: { [k: string]: any },
  options: ValidateObjectShapeOptions<K>
) {
  if (typeof o !== 'object') return false;
  for (let v in o) {
    if (o.hasOwnProperty(v) && options.allowedProperties.indexOf(v as K)) return false;
  }
  return true;
}

export function isNumberPredicateObject(p: any) {
  return validateObjectShape(p, {
    allowedProperties: ['gt', 'lt', 'gte', 'lte'],
    propertyTypes: {
      gt: 'number',
      gte: 'number',
      lte: 'number',
      lt: 'number'
    }
  });
}

function numberPredObjectToFn(p: NumberPropPredicate): (x: number) => boolean {
  return (x: number): boolean => {
    if (p.gt !== void 0 && x <= p.gt) return false;
    else if (p.gte !== void 0 && x < p.gte) return false;
    else if (p.lt !== void 0 && x >= p.lt) return false;
    else if (p.lte !== void 0 && x > p.lte) return false;
    return true;
  };
}

export function toPredicate<T>(
  loc: PredicateObject<Partial<T>>
): (item: T) => boolean {
  return (item: T) => {
    let checks: boolean[] = [];
    for (let k in loc) {
      let propPred: PropPredicate<T, keyof T> = loc[k] as any;
      if (propPred === void 0) continue;
      if (propPred instanceof RegExp) {
        // regex
        checks.push(propPred.test((item as any)[k]));
      } else if (typeof propPred === 'function') {
        // f(T) => boolean
        const predFn: (t: any) => boolean = propPred as any;
        checks.push(predFn(item[k]));
      } else if (isNumberPredicateObject(propPred)) {
        checks.push(numberPredObjectToFn(propPred as NumberPropPredicate)((item as any)[k]));
      } else {
        // value equality
        checks.push((item as any)[k] === propPred);
      }
    }
    return checks.every(Boolean);
  };
}
