/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./jest.config')
config.default.testMatch = ['**/*.spec.ts']
module.exports = config
