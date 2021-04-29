'use strict';
const {Docker} = require('node-docker-api');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const getDockerClient = () => {
    return docker
}

module.exports = getDockerClient