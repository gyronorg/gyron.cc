import log from 'simple-node-logger'
import path from 'path'

export default log.createSimpleLogger(path.join(__dirname, 'gyron.log'))
