import hello from 'object-predicate';

QUnit.module('object-predicate tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from object-predicate');
});
