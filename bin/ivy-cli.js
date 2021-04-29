#!/usr/bin/env node
const yargs = require('yargs')
require('better-logging')(console);
const run = require('../cli/run')

process.on('exit', (code) => {
    console.log('process exited with code: ' + code);
});

const loadConfigurationFromFile = require('../src/commands/load-configuration-from-config-file')

yargs.command({
    command: 'run',
    builder: {
      file: {
          describe: 'config file to run',
          demandOption: false,
          type: 'string',
          alias: 'f',
          default: process.env.IVY_CONFIG_FILE || 'ivy.config.yml'
      }
    },
    handler: async ({ file }) =>{
        const config = await loadConfigurationFromFile(file)
        await run(config)
    }
})



yargs.parse()