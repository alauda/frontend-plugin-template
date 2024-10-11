const {
  mfeConfigUtils: { shared },
} = require('@alauda-fe/devkit');

module.exports = {
  name: 'service',
  exposes: {
    './Routes': 'apps/service/src/app/remote-entry/entry.routes.ts',
    './Components': 'apps/service/src/app/remote-entry/entry.components.ts',
  },
  shared,
};
