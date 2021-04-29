const _ = require('lodash')
const createAndExecuteContainer = require('./create-and-execute-container')
const createAndExecuteManagerContainer = require('./create-manager-container')
const teardownManagerContainer = require('./tear-down-manager')
const { DEFAULT_NODE_CONTAINER } = require('../consts')
const sendGraphToManagerNode = require('./send-graph-to-manager-node')
const requestStatusFromManager = require('./request-status-from-manager')

const createAndExecuteContainerForNode = node => {
    return createAndExecuteContainer({
        ...DEFAULT_NODE_CONTAINER,
        Image: node.node.image
    }, {
        name: node.name,
        image: node.node.image,
    })
}

/**
 * Runs execution of process for a single node
 * @param node
 * @returns {Promise<void>}
 */
const runNode = async node => {
    console.info('Running node: ', node.name)
    const results = await createAndExecuteContainerForNode(node)
    console.info('Finished node: ', node.name)
    return results
}

const execute = async config => {
    if(!config) {
        return 'Execution model not defined'
    }

    // create the manager container
    await createAndExecuteManagerContainer().then(async () => {})
    // Post the graph config to the container
    // TODO: this could be replaced by copying the file to the docker container on create?
    await sendGraphToManagerNode(config)

    const { nodes: _nodes } = config
    let nodes = formatNodesFromYml(_nodes)
    if(!Array.isArray(_nodes))
        nodes = formatNodesFromYml([_nodes])

    const initial_node = nodes[0]
    if(!initial_node)
        throw new Error('No initial node could be found.')

    let node = initial_node
    let stackCount = 0
    const MAX_STACK_COUNT = 100
    while(node){
        await runNode(node)
        node = await getNextNodeFromManager()

        stackCount += 1
        if(stackCount > MAX_STACK_COUNT){
            throw new Error('Max stack count reached. Possible infinite loop. Cannot execute more than 100 nodes.')
        }
    }

    await teardownManagerContainer()
}

const getNextNodeFromManager = async () => {
    const status = await requestStatusFromManager()
    const nodeMap = getNodeMap(status.config.nodes)

    const previousNodeExecutionId = status.previous_node
    const previousNodeExecutionData = status.data[previousNodeExecutionId]

    if(!previousNodeExecutionData)
        return null

    const {
        edge,
        node_name
    } = previousNodeExecutionData

    const previousNode = nodeMap[node_name]

    const {
        edges
    } = previousNode

    const nextNodeName = edges[edge]

    if(nextNodeName === '-1'){
        return null
    }

    return {
        node: nodeMap[nextNodeName],
        name: nextNodeName
    }
}

const getNodeMap = nodeList => {
    return _.reduce(nodeList, (acc, v, i) => {
        return {
            ...acc,
            ...v
        }
    }, {})
}

const formatNodesFromYml = nodes => {
    return _.map(nodes, node => {
        const keyNodeName = _.first(_.keys(node))
        return {
            name: keyNodeName,
            node: node[keyNodeName]
        }
    })
}

module.exports = execute