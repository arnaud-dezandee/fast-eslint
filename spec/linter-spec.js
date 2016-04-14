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
      expect(messages.length).toEqual(5);
      [
        { range: [[0, 0], [0, 16]], type: 'Error' },
        { range: [[1, 0], [1, 13]], type: 'Error' },
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 7], [3, 25]], type: 'Error' },
        { range: [[3, 25], [3, 25]], type: 'Error' },
      ].forEach((expected, index) => {
        expect(messages[index].type).toEqual(expected.type);
        expect(messages[index].range).toEqual(expected.range);
      });
    });
  });

  it('finds something wrong with google/bad.js', () => {
    openFile('fixtures/google/bad.js', (messages) => {
      expect(messages.length).toEqual(5);
      [
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 7], [3, 25]], type: 'Error' },
        { range: [[3, 25], [3, 25]], type: 'Error' },
        { range: [[5, 0], [5, 19]], type: 'Warning' },
      ].forEach((expected, index) => {
        expect(messages[index].type).toEqual(expected.type);
        expect(messages[index].range).toEqual(expected.range);
      });
    });
  });

  it('finds something wrong with standard/bad.js', () => {
    openFile('fixtures/standard/bad.js', (messages) => {
      expect(messages.length).toEqual(7);
      [
        { range: [[0, 15], [0, 16]], type: 'Error' },
        { range: [[1, 12], [1, 13]], type: 'Error' },
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 7], [3, 25]], type: 'Error' },
        { range: [[5, 15], [5, 19]], type: 'Error' },
        { range: [[6, 18], [6, 19]], type: 'Error' },
        { range: [[9, 8], [9, 9]], type: 'Error' },
      ].forEach((expected, index) => {
        expect(messages[index].type).toEqual(expected.type);
        expect(messages[index].range).toEqual(expected.range);
      });
    });
  });

  it('finds something wrong with xo/bad.js', () => {
    openFile('fixtures/xo/bad.js', (messages) => {
      expect(messages.length).toEqual(5);
      [
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 0], [3, 25]], type: 'Error' },
        { range: [[3, 7], [3, 25]], type: 'Error' },
        { range: [[3, 25], [3, 25]], type: 'Error' },
        { range: [[6, 2], [6, 19]], type: 'Error' },
      ].forEach((expected, index) => {
        expect(messages[index].type).toEqual(expected.type);
        expect(messages[index].range).toEqual(expected.range);
      });
    });
  });

  it('reports nothing with ignored ignore/bad.js', () => {
    openFile('fixtures/ignore/bad.js', (messages) => {
      expect(messages.length).toEqual(0);
    });
  });
});
