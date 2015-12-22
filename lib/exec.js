'use babel';

/**
 * Dependencies
 */

import { allowUnsafeNewFunction } from 'loophole';
import CLIEngine from 'eslint/lib/cli-engine.js';

/**
 * Private
 */

const engine = new CLIEngine({
  extensions: ['.js'],
  ignore: true,
  useEslintrc: true,
  parser: 'espree',
  cache: false,
  allowInlineConfig: true,
});

/**
 * Interface
 */
export default function exec(filePath, fileText) {
  return new Promise((resolve, reject) => {
    try {
      allowUnsafeNewFunction(() => {
        resolve(engine.executeOnText(fileText, filePath));
      });
    } catch (error) {
      reject(error);
    }
  });
}
