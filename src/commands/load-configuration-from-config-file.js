const fs = require('fs')
const path = require('path')
const jsyaml = require('js-yaml')

const loadConfigurationFromFile = async file => {
    try {
        const contents = fs.readFileSync(path.join(process.cwd(), file), {encoding:"utf8", flag:"r"})
        const config = jsyaml.load(contents)
        return config
    } catch (e) {
        console.error(`Could not find or load ivy config file: ${file}\n\n`, e)
    }
}

module.exports = loadConfigurationFromFile