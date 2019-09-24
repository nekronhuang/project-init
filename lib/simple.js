const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const os = require('os');

module.exports = function({ project, react }) {
  fs.ensureDirSync(project);
  const root = path.resolve(project);
  const reactVer = `~${react}`;
  const packageJsonTpl = require(path.resolve(__dirname, '../template/package.json'));
  const packageJson = _.merge(packageJsonTpl, {
    name: project,
    resolutions: {
      // fix multi react in @types/react-dom
      '@types/react': reactVer,
    },
    dependencies: {
      react: reactVer,
      'react-dom': reactVer,
    },
    devDependencies: {
      '@types/react': reactVer,
      '@types/react-dom': reactVer,
    },
  });
  // mutate dependencies
  packageJson.dependencies = _(packageJson.dependencies).toPairs().sortBy(0).fromPairs().value();
  packageJson.devDependencies = _(packageJson.devDependencies).toPairs().sortBy(0).fromPairs().value();

  // 1. write package.json
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL);
};
