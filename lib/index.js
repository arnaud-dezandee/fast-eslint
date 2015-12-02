'use babel';

import path from 'path';
import { allowUnsafeNewFunction } from 'loophole';

let cli;
allowUnsafeNewFunction(() => {
  cli = require('eslint/lib/cli.js');
});

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
      scope: 'project',
      name: 'ESLint',
      lintOnFly: true,
      lint: (TextEditor) => {
        const filePath = TextEditor.getPath();
        const fileText = TextEditor.buffer.cachedText;

        const previousProcessCwd = process.cwd();
        const previousConsoleLog = console.log;

        let result;

        try {
          console.log = json => {
            result = JSON.parse(json);
          };
          process.chdir(path.dirname(filePath));
          allowUnsafeNewFunction(() => {
            cli.execute(['node', 'eslint', '-f', 'json', filePath], fileText);
          });
        } finally {
          process.chdir(previousProcessCwd);
          console.log = previousConsoleLog;
        }

        return result[0].messages.map(({column, line, message, ruleId, severity}) => {
          const range = helpers.rangeFromLineNumber(TextEditor, line - 1);
          if (column) range[0][1] = column - 1;
          if (column > range[1][1]) range[1][1] = column - 1;

          return {
            filePath: filePath,
            type: severity === 1 ? 'Warning' : 'Error',
            range: range,
            html: `<span class="badge badge-flexible">${ruleId || 'Fatal'}</span> ${message}`,
          };
        });
      },
    };
  },
};
