const axios = require('axios')
const { MANAGER_CONTAINER_URL } = require('../consts')

const sendGraphToManagerNode = async () => {
    const result = await axios.get(MANAGER_CONTAINER_URL + '/status')
    return result.data
}

module.exports = sendGraphToManagerNode