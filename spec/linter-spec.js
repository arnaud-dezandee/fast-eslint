'use babel';

/**
 * Dependencies
 */

import path from 'path';
process.chdir('/');

/**
 * Tests
 */

describe('Fast-ESLint provider for Linter', () => {
  const lint = require('../lib/index.js').provideLinter().lint;

  const openFile = (fileName, cb) => (
    waitsForPromise(() => (
      atom.workspace
        .open(path.join(__dirname, fileName))
        .then(editor => lint(editor).then(cb))
    ))
  );

  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('fast-eslint'));
  });

  it('finds something wrong with airbnb/bad.js', () => {
    openFile('fixtures/airbnb/bad.js', (messages) => {
      expect(messages.length).toEqual(9);
      const expected = [
        { range: [[0, 0], [0, 3]], type: 'Error' },
        { range: [[1, 0], [1, 3]], type: 'Error' },
        { range: [[3, 0], [3, 2]], type: 'Error' },
        { range: [[3, 7], [3, 13]], type: 'Error' },
        { range: [[3, 25], [3, 25]], type: 'Error' },
        { range: [[10, 0], [10, 0]], type: 'Error' },
        { range: [[11, 0], [11, 1]], type: 'Error' },
        { range: [[11, 0], [11, 1]], type: 'Error' },
        { range: [[11, 1], [11, 1]], type: 'Error' },
      ];
      expect(messages.map(({ range, type }) => ({ range, type }))).toEqual(expected);
    });
  });

  it('reports nothing with ignored ignore/bad.js', () => {
    openFile('fixtures/ignore/bad.js', (messages) => {
      expect(messages.length).toEqual(0);
    });
  });
});
