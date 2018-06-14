// Read config key which use depend on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  // Produciton environment
  module.exports = require('./prod')
} else if (process.env.NODE_ENV === 'staging') {
  // Stagging environment
  module.exports = require('./stag')
} else {
  // Development or other environment
  module.exports = require('./dev');
}