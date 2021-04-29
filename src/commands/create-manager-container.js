const path = require('path')
const { v4: uuid } = require('uuid')
const createAndExecuteContainer = require('./create-and-execute-container')
const teardownManagerContainer = require('./tear-down-manager')
const { MANAGER_CONTAINER_NAME } = require('../consts')

const MANAGER_CONTAINER = {
    Image: 'ivy/manager',
    ExposedPorts: {
        "8080/tcp": {}
    },
    HostConfig: {
        Binds: [`${path.join(__dirname, '../system')}:/var/ivy/manager`],
        PortBindings: {
            "8080/tcp": [{"HostPort": "8080"}]
        }
    },
    name: MANAGER_CONTAINER_NAME
}

const createAndExecuteManagerContainer = async () => {
    await teardownManagerContainer()
    await createAndExecuteContainer( {
        ...MANAGER_CONTAINER,
        Env: [
            `IVY_EXEC_ID=${uuid()}`
        ],
    }, {
        is_manager: true
    })
}

module.exports = createAndExecuteManagerContainer