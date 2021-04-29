const docker = require('../lib/docker-client')
const chalk = require('chalk');

const ensureManagerContainer = async () => {
    try {
        const container = docker.container.get('ivy_manager')
        if(container){
            console.info(chalk.greenBright('Stopping ivy manager container.'))
            await container.stop()
            console.info(chalk.greenBright('Manager container stopped. Removing container.'))
            await container.delete()
            console.info(chalk.greenBright('Manager container removed'))
        }
    } catch(e){
        if (!e.statusCode === 404){
            throw e
        }
    }
}

module.exports = ensureManagerContainer
