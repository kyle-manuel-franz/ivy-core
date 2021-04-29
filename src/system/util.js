const getWriteModeForCurrentNode = state => {
    const current_node = state.nodes[state.current_node_name]
    return current_node.write_mode
}

module.exports = {
    getWriteModeForCurrentNode
}