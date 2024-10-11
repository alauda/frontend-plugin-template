const {
  mfeConfigUtils: { shared },
} = require('@alauda-fe/devkit');

module.exports = {
  name: 'deploy-instance',
  exposes: {
    './Routes': 'apps/deploy-instance/src/app/remote-entry/entry.routes.ts',
    './Components': 'apps/deploy-instance/src/app/remote-entry/entry.components.ts',
  },
  shared,
};
