'use babel';
/* eslint-env jasmine */
/* global waitsForPromise */

describe('Fast-ESLint provider for Linter', () => {
  const lint = require('../lib/index.js').provideLinter().lint;

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('fast-eslint');
    });
  });

  it('finds something wrong with bad.js', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/files/bad.js').then(editor => {
        const messages = lint(editor);
        expect(messages.length).toEqual(6);

        expect(messages[0].type).toEqual('Error');
        expect(messages[0].range).toEqual([[0, 0], [0, 18]]);
        expect(messages[0].html).toEqual(
          `<span class="badge badge-flexible">no-var</span> Unexpected var, use let or const instead.`
        );

        expect(messages[1].type).toEqual('Error');
        expect(messages[1].range).toEqual([[0, 4], [0, 18]]);
        expect(messages[1].html).toEqual(
          `<span class="badge badge-flexible">no-unused-vars</span> "test" is defined but never used`
        );

        expect(messages[2].type).toEqual('Error');
        expect(messages[2].range).toEqual([[2, 0], [2, 22]]);
        expect(messages[2].html).toEqual(
          `<span class="badge badge-flexible">no-undef</span> "myFunc" is not defined.`
        );

        expect(messages[3].type).toEqual('Warning');
        expect(messages[3].range).toEqual([[2, 9], [2, 22]]);
        expect(messages[3].html).toEqual(
          `<span class="badge badge-flexible">func-names</span> Missing function expression name.`
        );

        expect(messages[4].type).toEqual('Error');
        expect(messages[4].range).toEqual([[2, 17], [2, 22]]);
        expect(messages[4].html).toEqual(
          `<span class="badge badge-flexible">space-before-function-paren</span> Unexpected space before function parentheses.`
        );
      });
    });
  });
});
