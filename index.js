#!/usr/bin/env node

const {resolve} = require('path')
const {Command} = require('commander');
const program = new Command();
const deploy = require('./commands/deploy');
const envize = require('./commands/envize');

program
    .name('spacey')
    .description('CLI to some JavaScript string utilities')
    .version(require('./package.json').version);

program
    .command('deploy')
    .description('Deploys all repositories')
    .argument('<directory>', 'directory to install')
    .action((directory) => deploy(resolve(directory)));

program
    .command('envize')
    .description('fills .env (only for PHP repos')
    .argument('<directory>', 'directory to install')
    .action((directory) => envize(resolve(directory)));

program.parse();