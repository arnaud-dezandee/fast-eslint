'use babel';

/**
 * Dependencies
 */

import exec from './exec.js';

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
        const fileText = TextEditor.buffer.cachedText;

        return exec(filePath, fileText).then(report => {
          if (!report || !report.results) return [];

          return report.results[0].messages.map(({ column, line, message, ruleId, severity }) => {
            const range = helpers.rangeFromLineNumber(TextEditor, line - 1);
            if (column) range[0][1] = column - 1;
            if (column > range[1][1]) range[1][1] = column - 1;

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
