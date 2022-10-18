module.exports = function () {
  try {
    return require('child_process').execSync('git rev-parse HEAD').toString().trim()
  } catch (error) {
    return 'Revision not available'
  }
}
