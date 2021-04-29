const execute = require('../src/commands/execute')

const run = async config => {
    await execute(config)
}

module.exports = run