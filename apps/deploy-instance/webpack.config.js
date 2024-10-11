const {
  compose,
  withRemoteMfeConfig,
  withBaseConfig,
} = require('@alauda-fe/devkit');

const mfeConfig = require('./module-federation.config');

module.exports = async (config) => {
  const applyCustom = compose(
    await withRemoteMfeConfig(mfeConfig),
    withBaseConfig()
  );

  return applyCustom(config);
};
