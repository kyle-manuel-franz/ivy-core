const docker = require('../lib/docker-client')
const _ = require('lodash')
const { v4: uuid } = require('uuid')
const { DEFAULT_NODE_CONTAINER } = require('../consts')
const chalk = require('chalk');

const generateNodeContainerConfig = node_config => {
    if(!!node_config){
        return node_config
    }

    return DEFAULT_NODE_CONTAINER
}

const createAndExecuteContainer = (node_config, opts = {}) => {
    return new Promise((resolve, reject) => {
        const containerConfig = generateNodeContainerConfig(node_config)

        if(!opts.is_manager){
            containerConfig.Env = _.compact(_.concat(containerConfig.Env, [
                `NODE_EXEC_ID=${uuid()}`,
                `NODE_NAME=${opts.name}`,
                `IVY_EMAIL_USER=${process.env.IVY_EMAIL_USER}`,
                `IVY_EMAIL_PASSWORD=${process.env.IVY_EMAIL_PASSWORD}`
            ]))
        }

        let _container
        docker.container.create(containerConfig)
            .then(container => {
                _container = container
                return container.start()
            })
            .then(container => {
                return container.logs({
                    follow: true,
                    stdout: true,
                    stderr: true
                })
            })
            .then(stream => {
                stream.on('data', data => {
                    const lines = data.toString().split('\n')
                    _.each(lines, l => {
                        console.info(
                            `[${
                                opts.is_manager ?
                                    chalk.red('manager') :
                                    chalk.blue('W:' + _container.id.substring(0, 5) + ':' + opts.name)
                            }]`,
                            l
                        )
                    })


                })
                stream.on('error', error => {
                    console.info(
                        `[${chalk.blue(_container.id.substring(0, 5))}]`,
                        error.toString()
                    )
                    reject()
                })
                stream.on('end', data => {
                    resolve(data)
                })

                // cant wait for stream end because manager stays open
                if(opts.is_manager){
                    // hack give two seconds to initialize
                    setTimeout(() => {
                        resolve()
                    }, 2000)
                }
            })
    })
}

module.exports = createAndExecuteContainer