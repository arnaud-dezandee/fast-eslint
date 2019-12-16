'use babel';

/**
* Dependencies
*/

const { CompositeDisposable, Range } = require('atom');
const { initEngine, isIgnored, exec } = require('./exec');

/**
* Interface
*/

module.exports = {
  activate() {
    require('atom-package-deps').install('fast-eslint');

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe('fast-eslint.baseConfigExtends', (presets) => initEngine(presets)));
    this.subscriptions.add(atom.config.observe('fast-eslint.grammarScopes', (scopes) => {
      this.grammarScopes = scopes;
    }));
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
      lintsOnChange: true,
      lint: (TextEditor) => {
        const filePath = TextEditor.getPath();
        const fileText = TextEditor.getText();
        const fileBuffer = TextEditor.getBuffer();
        const ignoreFile = helpers.find(filePath, '.eslintignore');

        if (ignoreFile && isIgnored(ignoreFile, filePath)) {
          return new Promise((resolve) => resolve([]));
        }

        return exec(filePath, fileText).then((report) => {
          if (!report || !report.results || !report.results.length) return [];

          return report.results[0].messages.map(({ column = 1, line, message, ruleId, severity, fix }) => {
            const lineLength = TextEditor.getBuffer().lineLengthForRow(line - 1);
            const colStart = (column - 1 > lineLength) ? (lineLength + 1) : column;
            const position = helpers.generateRange(TextEditor, line - 1, colStart - 1);

            return {
              severity: severity === 1 ? 'warning' : 'error',
              excerpt: `${ruleId || 'fatal'}: ${message}`,
              solutions: fix ? [{
                position: new Range(
                  fileBuffer.positionForCharacterIndex(fix.range[0]),
                  fileBuffer.positionForCharacterIndex(fix.range[1]),
                ),
                replaceWith: fix.text,
              }] : null,
              location: {
                file: filePath,
                position,
              },
            };
          });
        });
      },
    };
  },
};
