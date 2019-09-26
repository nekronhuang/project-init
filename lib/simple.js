const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const os = require('os');

/** sort dependencies by dict */
function sortDependencies(deps) {
  return _(deps)
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value();
}

module.exports = function({ project, react }) {
  fs.ensureDirSync(project);
  const root = path.resolve(project);
  const reactVer = `~${react}`;
  const packageJsonTpl = require(path.resolve(__dirname, '../template/package.json'));
  const packageJsonPath = path.join(root, 'package.json');
  const base = fs.existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  const packageJson = _.merge(base, packageJsonTpl, {
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
  packageJson.dependencies = sortDependencies(packageJson.dependencies);
  packageJson.devDependencies = sortDependencies(packageJson.devDependencies);

  // 1. generate package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + os.EOL);

  // 2. copy config
  ['.commitlintrc.js', '.eslintrc', '.prettierrc', 'tsconfig.json', '.gitignore'].forEach((file) => {
    fs.copyFileSync(path.resolve(__dirname, `../template/${file}`), path.join(root, file));
  });

  // 3. init source code
  fs.ensureFileSync(path.join(root, 'src', 'index.ts'));
  fs.ensureFileSync(path.join(root, 'src', 'style.less'));
};
