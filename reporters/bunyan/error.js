'use strict'

function errorHelp (e) {
  switch (e.code) {
    case 'EADDRINUSE':
      return {
        description: `Port :${ e.port } already in use`,
        hint: [
          'Another Logux server or other app already running on this port',
          'Maybe you didn’t not stop server from other project',
          'or previous version of this server was not killed.'
        ]
      }
    case 'EACCES':
      return {
        description: 'You are not allowed to run server on this port',
        hint: [
          'Try to change user (e.g. root) or use port >= 1024'
        ]
      }
    default:
      throw e
  }
}

module.exports = function errorReporter (err) {
  const help = errorHelp(err)
  return {
    level: 'error',
    msg: help.description,
    details: {
      hint: help.hint
    }
  }
}
