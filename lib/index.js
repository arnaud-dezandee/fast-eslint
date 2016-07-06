'use babel';

/**
* Dependencies
*/

import { isIgnored, exec } from './exec.js';

/**
* Interface
*/

export default {
  activate() {
    require('atom-package-deps').install('fast-eslint');
  },

  provideLinter() {
    const helpers = require('atom-linter');

    return {
      grammarScopes: [
        'source.js',
        'source.js.jsx',
        'source.babel',
        'source.js-semantic',
        'source.es6',
      ],
      scope: 'file',
      name: 'ESLint',
      lintOnFly: true,
      lint: (TextEditor) => {
        const filePath = TextEditor.getPath();
        const fileText = TextEditor.getText();
        const ignoreFile = helpers.find(filePath, '.eslintignore');

        if (ignoreFile && isIgnored(ignoreFile, filePath)) {
          return new Promise((resolve) => resolve([]));
        }

        return exec(filePath, fileText).then(report => {
          if (!report || !report.results) return [];

          return report.results[0].messages.map(({ column, line, message, ruleId, severity }) => {
            const lineLength = TextEditor.getBuffer().lineLengthForRow(line - 1);
            const colStart = (column > lineLength) ? lineLength : column;
            const range = helpers.rangeFromLineNumber(TextEditor, line - 1, colStart ? colStart - 1 : colStart);

            return {
              filePath,
              range,
              type: severity === 1 ? 'Warning' : 'Error',
              html: `<span class="badge badge-flexible">${ruleId || 'Fatal'}</span> ${message}`,
            };
          });
        });
      },
    };
  },
};
