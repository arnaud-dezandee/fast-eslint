'use babel';

/**
 * Dependencies
 */

import path from 'path';

process.chdir('/');

/**
 * Privates
 */

const lint = require('../lib/index.js').provideLinter().lint;

const openFile = filePath => (
  atom.workspace
    .open(filePath)
    .then(editor => lint(editor))
);

const htmlMsg = (ruleId, message) => (
  `<span class="badge badge-flexible">${ruleId || 'Fatal'}</span> ${message}`
);

/**
 * Tests
 */

describe('Fast-ESLint provider for Linter', () => {
  beforeEach(() =>
    waitsForPromise(() => atom.packages.activatePackage('fast-eslint')),
  );

  describe('finds something wrong with airbnb/bad.js', () => {
    const filePath = path.join(__dirname, 'fixtures/airbnb/bad.js');
    const expectedRuleIds = [
      'no-var', 'keyword-spacing', 'eqeqeq',
      'no-undef', 'semi', 'no-multiple-empty-lines',
      'no-unused-expressions', 'no-undef', 'semi',
    ];
    const expectedRanges = [
      { start: { row: 0, column: 0 }, end: { row: 0, column: 3 } },
      { start: { row: 2, column: 0 }, end: { row: 2, column: 2 } },
      { start: { row: 2, column: 7 }, end: { row: 2, column: 13 } },
      { start: { row: 2, column: 10 }, end: { row: 2, column: 13 } },
      { start: { row: 2, column: 25 }, end: { row: 2, column: 25 } },
      { start: { row: 7, column: 0 }, end: { row: 7, column: 0 } },
      { start: { row: 10, column: 0 }, end: { row: 10, column: 1 } },
      { start: { row: 10, column: 0 }, end: { row: 10, column: 1 } },
      { start: { row: 10, column: 1 }, end: { row: 10, column: 1 } },
    ];
    const expectedMessages = [
      'Unexpected var, use let or const instead.',
      'Expected space(s) after "if".',
      'Expected \'===\' and instead saw \'==\'.',
      '\'bar\' is not defined.',
      'Missing semicolon.',
      'More than 2 blank lines not allowed.',
      'Expected an assignment or function call and instead saw an expression.',
      '\'a\' is not defined.',
      'Missing semicolon.',
    ];
    let results = [];

    beforeEach(() =>
      waitsForPromise(() =>
        openFile(filePath).then(messages => (results = messages)),
      ),
    );

    it('messages length', () => {
      expect(results.length).toEqual(9);
    });

    expectedRuleIds.forEach((rule, idx) => {
      it(rule, () => {
        const { filePath: file, range, type, html } = results[idx];
        expect(file).toEqual(filePath);
        expect(range).toEqual(expectedRanges[idx]);
        expect(type).toEqual('Error');
        expect(html).toEqual(htmlMsg(expectedRuleIds[idx], expectedMessages[idx]));
      });
    });
  });

  describe('finds nothing with ignored ignore/bad.js', () => {
    const filePath = path.join(__dirname, 'fixtures/ignore/bad.js');
    let results = [];

    beforeEach(() =>
      waitsForPromise(() =>
        openFile(filePath).then(messages => (results = messages)),
      ),
    );

    it('ignored', () => {
      expect(results.length).toEqual(0);
    });
  });
});
