process.env.CONFIG_PREFER_PRETTIER = '1';

const fs = require('node:fs');
const path = require('node:path');

const APPS_DIR = path.resolve('apps');

const tsconfigPath = app => `apps/${app}/tsconfig.app.json`;

const tsconfigExist = app => {
  try {
    fs.accessSync(tsconfigPath(app), fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const apps = fs
  .readdirSync(APPS_DIR)
  .filter(
    app => !app.startsWith('.') && !app.endsWith('-e2e') && tsconfigExist(app),
  )
  .reduce((acc, app) => {
    return {
      ...acc,
      [`apps/${app}/**/*.{html,ts}`]: () =>
        `ngc -p ${tsconfigPath(app)} --noEmit`,
    };
  }, {});

module.exports = {
  ...require('@1stg/lint-staged'),
  ...apps,
  '*': 'cspell --no-must-find-files --no-progress',
};
