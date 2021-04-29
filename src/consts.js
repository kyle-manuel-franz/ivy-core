const MANAGER_CONTAINER_NAME = 'ivy_manager'

const DEFAULT_NODE_CONTAINER = {
    HostConfig: {
        Links: [`${MANAGER_CONTAINER_NAME}:manager`]
    }
}

const MANAGER_CONTAINER_URL = 'http://localhost:8080'

module.exports = {
    DEFAULT_NODE_CONTAINER,
    MANAGER_CONTAINER_NAME,
    MANAGER_CONTAINER_URL
}