const getDockerClient = require('./get-docker-client')
const docker = getDockerClient()

module.exports = docker