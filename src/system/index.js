const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const _ = require('lodash')

const {
    getWriteModeForCurrentNode
} = require('./util')

const DEFAULT_EDGE = 'default'

// keep state in memory for now
const state = {
    config: null,
    nodes: {},
    id: process.env.IVY_EXEC_ID,
    started: false,
    current_node: null,
    current_node_name: null,
    previous_node: null,
    data: {}
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// TODO: Validate the data on finish and make sure schema matches before sending it to state in memory
// TODO: When a single node fails, end the entire process
// TODO: Make independent client ivy npm module

app.post('/node/initialize', (req, res) => {
    const {
        node_ec_id,
        node_name
    } = req.query

    if(!!state.data[node_ec_id] || state.current_node === node_ec_id){
        res.status(500)
        res.send('Cannot call initialize more than once per node execution instance')
        return
    }

    state.current_node = node_ec_id
    state.current_node_name = node_name

    const previous_node_data = state.data[state.previous_node]

    const response = {
        previous_node_data,
        node: state.nodes[node_name]
    }

    res.send(response)
})

app.post('/node/finish', async (req, res) => {
    const {
        data
    } = req.body

    if(!!state.data[state.current_node]) {
        res.status(500)
        res.send('Cannot call finish more than once per node execution instance')
        return
    }

    const write_mode = getWriteModeForCurrentNode(state)
    if(write_mode){
        const previous_data = state.data[state.previous_node].data

        const merged_data = _.map(previous_data, d => {
            const matched_value = _.find(data.data, dd => {
                return _.includes(d[write_mode.on], dd[write_mode.on])
            })

            return {
                ...d,
                ...matched_value
            }
        })

        state.data = {
            ...state.data,
            [state.current_node]: {
                data: merged_data,
                schema: data.schema,
                node_name: state.current_node_name,
                edge: DEFAULT_EDGE,
                previous_node: state.previous_node
            }
        }
    } else {
        state.data = {
            ...state.data,
            [state.current_node]: {
                data: data.data,
                schema: data.schema,
                node_name: state.current_node_name,
                edge: DEFAULT_EDGE,
                previous_node: state.previous_node
            }
        }
    }

    state.previous_node = state.current_node
    res.send()
})

app.post('/set_config', async (req, res) => {
    const {
        config
    } = req.body

    if(state.config !== null){
        res.status(400)
        res.send('Graph already initialized. This route can only be called once per instance.')
    }

    state.config = config
    state.nodes = Object.assign({}, ...state.config.nodes)

    res.status(200)
    res.send('OK')
})

app.get('/status', async (req, res) => {
    res.send(state)
})

app.get('/test', async (req, res) => {
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`Manager listening on port: ${port}`)
})