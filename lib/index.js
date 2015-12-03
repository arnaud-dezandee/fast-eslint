'use babel';

import path from 'path';
import { allowUnsafeNewFunction } from 'loophole';

const Module = require('module').Module;
const oldResolveLookupPaths = Module._resolveLookupPaths;

let cli;
allowUnsafeNewFunction(() => {
  cli = require('eslint/lib/cli.js');
});

function uniq(array) {
  const temp = {};
  const res = [];

  array.forEach(value => {
    if (temp.hasOwnProperty(value)) {
      return;
    }
    res.push(value);
    temp[value] = 1;
  });

  return res;
}

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
        const nodeModulePaths = Module._nodeModulePaths(path.dirname(filePath));

        const previousProcessCwd = process.cwd();
        const previousConsoleLog = console.log;

        let result;

        try {
          Module._resolveLookupPaths = (request, parent) => {
            if (parent.filename.match(/config-file\.js|eslint\.js/)) {
              parent.paths = uniq((parent.paths || []).concat(nodeModulePaths));
            }
            return oldResolveLookupPaths.call(this, request, parent);
          };
          process.chdir(path.dirname(filePath));
          console.log = json => {
            result = JSON.parse(json);
          };
          allowUnsafeNewFunction(() => {
            cli.execute(['node', 'eslint', '-f', 'json', filePath], fileText);
          });
        } finally {
          Module._resolveLookupPaths = oldResolveLookupPaths;
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
