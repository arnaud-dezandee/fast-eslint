'use babel';

describe('Fast-ESLint provider for Linter', () => {
  const lint = require('../lib/index.js').provideLinter().lint;

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.packages.activatePackage('fast-eslint');
    });
  });

  it('finds something wrong with airbnb/bad.js', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/fixtures/airbnb/bad.js').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(5);

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
          expect(messages[4].range).toEqual([[4, 1], [4, 1]]);
          expect(messages[4].html).toEqual(
            `<span class="badge badge-flexible">semi</span> Missing semicolon.`
          );
        });
      });
    });
  });

  it('finds something wrong with config/bad.js', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/fixtures/config/bad.js').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(1);

          expect(messages[0].type).toEqual('Error');
          expect(messages[0].range).toEqual([[0, 12], [0, 13]]);
          expect(messages[0].html).toEqual(
            `<span class="badge badge-flexible">semi</span> Extra semicolon.`
          );
        });
      });
    });
  });
});
