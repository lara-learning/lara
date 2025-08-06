module.exports = function () {
  try {
    return require('child_process').execSync('git rev-parse HEAD').toString().trim()
  } catch (_) {
    return 'Revision not available'
  }
}
