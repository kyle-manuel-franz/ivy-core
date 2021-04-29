'use strict';
const getDockerClient = require('../lib/get-docker-client')

const listDockerContainers = () => {
    const docker = getDockerClient()
    return docker.container.list()
}

module.exports = listDockerContainers

