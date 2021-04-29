const axios = require('axios')
const { MANAGER_CONTAINER_URL } = require('../consts')

const sendGraphToManagerNode = async config => {
    await axios.post(MANAGER_CONTAINER_URL + '/set_config', {
        config
    })
}

module.exports = sendGraphToManagerNode