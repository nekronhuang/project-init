#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const semver = require('semver');
const { prompt } = require('inquirer');
const packageJson = require('./package.json');

program
  .version(packageJson.version)
  .name(packageJson.name)
  .usage('<command>')
  .description('init a new project');

const SIMPLE_LIB = 'simple-react-library';
const FULL_LIB = 'full-react-library';

prompt([
  {
    type: 'input',
    name: 'project',
    message: 'Project name:',
    default: 'my-project',
    filter(v) {
      return v.trim();
    },
    validate(v) {
      // todo: need validate the project name
      return v.length > 0 ? true : chalk.red('Please specify the project name.');
    },
    transformer(v) {
      return chalk.green(v);
    },
  },
  {
    type: 'list',
    name: 'template',
    message: 'Project template:',
    choices: [
      {
        name: chalk.green(SIMPLE_LIB),
        value: SIMPLE_LIB,
      },
      {
        name: chalk.red(FULL_LIB),
        value: FULL_LIB,
      },
    ],
    default: SIMPLE_LIB,
  },
  {
    type: 'input',
    name: 'react',
    message: 'React version:',
    when: ({ template }) => template === SIMPLE_LIB,
    validate(v) {
      return semver.valid(v) ? true : chalk.red('Please specify a valid version');
    },
    default: '16.8.0',
    transformer(v) {
      return chalk.green(v);
    },
  },
]).then((info) => {
  const { template } = info;
  if (template === SIMPLE_LIB) {
    return require('./lib/simple')(info);
  }

  console.error(chalk.red('This template is not supported~'));
  process.exit(1);
});
