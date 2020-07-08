'use babel';

/**
 * Dependencies
 */
const path = require('path');
const { lint } = require('../lib/index.js').provideLinter();

process.chdir('/');

/**
 * Privates
 */

const openFile = (filePath) => (
  atom.workspace
    .open(filePath)
    .then((editor) => lint(editor))
);

const formatedMsg = (ruleId, message) => (
  `${ruleId || 'fatal'}: ${message}`
);

/**
 * Tests
 */

describe('Fast-ESLint provider for Linter', () => {
  beforeEach(() => waitsForPromise(() => atom.packages.activatePackage('fast-eslint')));

  describe('finds something wrong with airbnb/bad.js', () => {
    const filePath = path.join(__dirname, 'fixtures/airbnb/bad.js');
    const expectedRuleIds = [
      'no-var', 'keyword-spacing', 'eqeqeq',
      'no-undef', 'semi', 'no-multiple-empty-lines',
      'no-unused-expressions', 'no-undef', 'semi',
    ];
    const expectedRanges = [
      [[0, 0], [0, 3]],
      [[2, 0], [2, 2]],
      [[2, 7], [2, 13]],
      [[2, 10], [2, 13]],
      [[2, 25], [2, 25]],
      [[8, 0], [8, 0]],
      [[10, 0], [10, 1]],
      [[10, 0], [10, 1]],
      [[10, 1], [10, 1]],
    ];
    const expectedMessages = [
      'Unexpected var, use let or const instead.',
      'Expected space(s) after "if".',
      'Expected \'===\' and instead saw \'==\'.',
      '\'bar\' is not defined.',
      'Missing semicolon.',
      'More than 1 blank line not allowed.',
      'Expected an assignment or function call and instead saw an expression.',
      '\'a\' is not defined.',
      'Missing semicolon.',
    ];
    let results = [];

    beforeEach(() => waitsForPromise(() => openFile(filePath).then((messages) => { results = messages; })));

    it('messages length', () => {
      expect(results.length).toEqual(9);
    });

    expectedRuleIds.forEach((rule, idx) => {
      it(rule, () => {
        const { location: { file, position }, severity, excerpt } = results[idx];
        expect(file).toEqual(filePath);
        expect(position).toEqual(expectedRanges[idx]);
        expect(severity).toEqual('error');
        expect(excerpt).toEqual(formatedMsg(expectedRuleIds[idx], expectedMessages[idx]));
      });
    });
  });

  describe('finds nothing with ignored ignore/bad.js', () => {
    const filePath = path.join(__dirname, 'fixtures/ignore/bad.js');
    let results = [];

    beforeEach(() => waitsForPromise(() => openFile(filePath).then((messages) => { results = messages; })));

    it('ignored', () => {
      expect(results.length).toEqual(0);
    });
  });
});
