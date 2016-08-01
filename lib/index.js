'use babel';

/**
* Dependencies
*/

import { CompositeDisposable } from 'atom';
import { initEngine, isIgnored, exec } from './exec.js';

/**
* Interface
*/

export default {
  activate() {
    require('atom-package-deps').install();

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe(
      'fast-eslint.baseConfigExtends', presets => initEngine(presets)
    ));
    this.subscriptions.add(atom.config.observe(
      'fast-eslint.grammarScopes', scopes => { this.grammarScopes = scopes; }
    ));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    const helpers = require('atom-linter');

    return {
      grammarScopes: this.grammarScopes,
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

          return report.results[0].messages.map(({ column = 1, line, message, ruleId, severity }) => {
            const lineLength = TextEditor.getBuffer().lineLengthForRow(line - 1);
            const colStart = (column - 1 > lineLength) ? (lineLength + 1) : column;
            const range = helpers.rangeFromLineNumber(
              TextEditor, line - 1, colStart - 1
            );

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
