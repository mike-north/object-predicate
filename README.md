# object-predicate

[![Build Status](https://travis-ci.org/mike-north/object-predicate.svg?branch=master)](https://travis-ci.org/mike-north/object-predicate)
[![Version](https://img.shields.io/npm/v/object-predicate.svg)](https://www.npmjs.com/package/object-predicate)

Use simple objects to represent predicates in JavaScript and TypeScript

## Setup

```
npm install object-predicate
```
## Why

Sometimes we need to be able to store a predicate as JSON data. Regex and function support added on top of this for convenience

## Use

```ts
import { toPredicate } from 'object-predicate';

interface Character {
  name: string;
  age: number;
  occupation: string;
};

const characters: Character[] = [
  { name: 'Walter White',  age: 51, occupation: 'Chemistry Teacher' },
  { name: 'Gustavo Freng', age: 53, occupation: 'Restaurant Owner' },
  { name: 'Hank Schrader', age: 48, occupation: 'DEA Agent' },
  { name: 'Skyler White',  age: 47, occupation: 'Accountant' },
]

// Number predicate (greater-than, less-than, greater-or-equal, less-or equal)
const over50 = toPredicate({
  age: { gt: 50 }
});
const charactersOver50 = characters.filter(over50);

// Exact string match
const isAccountant = toPredicate({
  occupation: 'Accountant'
});
const accountants = characters.filter(isAccountant);

// Using a regex
const nameEndsWithWhite = toPredicate({
  name: /White$/
});
const whiteFamily = characters.filter(nameEndsWithWhite);

// Using a property predicate
const isDea = toPredicate({
  occupation: o => o.indexOf('DEA') >= 0
});
const deaAgents = characters.filter(isDea);
```