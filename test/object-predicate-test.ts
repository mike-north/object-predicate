import { toPredicate } from 'object-predicate';
import { suite, test } from 'qunit-decorators';

interface Character {
  name: string;
  age: number;
  occupation: string;
}

const WALTER: Character = {
  age: 51,
  name: 'Walter White',
  occupation: 'Chemistry Teacher'
};
const WALT_WHITMAN: Character = {
  age: 48,
  name: 'Walt Whitman',
  occupation: 'Writer'
};
const OLDER_WALTER: Character = {
  age: 52,
  name: 'Walter White',
  occupation: 'Chemistry Teacher'
};
const JESSE: Character = {
  age: 31,
  name: 'Jesse Pinkman',
  occupation: 'Meth Cook'
};
const EMPTY: any = {};

@suite('object-predicate tests')
export class ObjectPredicateTests {
  @test
  'single-property filtering on simple value'(assert: Assert) {
    const pred = toPredicate<Character>({
      name: 'Walter White'
    });
    assert.ok(pred, 'toPredicate returns something truthy');
    assert.ok(pred(WALTER), 'matches are correctly identified');
    assert.notOk(pred(JESSE), 'mismatches are correctly identified');
    assert.notOk(pred(EMPTY), 'malformed objects do not break');
  }

  @test
  'multiple-property filtering on simple values'(assert: Assert) {
    const pred = toPredicate<Character>({ name: 'Walter White', age: 52 });
    assert.notOk(pred(WALTER));
    assert.notOk(pred(JESSE));
    assert.ok(pred(OLDER_WALTER));
  }

  @test
  'property filtering on regex'(assert: Assert) {
    const waltPred = toPredicate<Character>({ name: /Walt/ });
    assert.ok(waltPred(WALTER));
    assert.ok(waltPred(WALT_WHITMAN));
    assert.notOk(waltPred(JESSE));
  }

  @test
  'property filtering on predicate'(assert: Assert) {
    const pred = toPredicate<Character>({
      name(s) { return !!s && s.indexOf('ss') >= 0; }
    });
    assert.notOk(pred(WALTER));
    assert.notOk(pred(WALT_WHITMAN));
    assert.ok(pred(JESSE));
  }

  @test
  'number predicate object'(assert: Assert) {
    const pred1 = toPredicate<Character>({
      age: { gt: 30 }
    });
    const pred2 = toPredicate<Character>({
      age: { gt: 33 }
    });

    assert.ok(pred1(WALTER));
    assert.ok(pred1(WALT_WHITMAN));
    assert.ok(pred1(JESSE));
    assert.ok(pred2(WALTER));
    assert.ok(pred2(WALT_WHITMAN));
    assert.notOk(pred2(JESSE));
  }
}
