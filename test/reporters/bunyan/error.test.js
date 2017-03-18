'use strict'

const bunyan = require('bunyan')

const errorReporter = require('../../../reporters/bunyan/error')

const BaseServer = require('../../../base-server')

function errorHelperOut () {
  return errorReporter.apply({}, arguments)
}

const log = bunyan.createLogger({
  name: 'logux-server-test',
  streams: []
})

const app = new BaseServer({
  env: 'development',
  pid: 21384,
  nodeId: 'server:H1f8LAyzl',
  subprotocol: '2.5.0',
  supports: '2.x || 1.x',
  reporter: 'bunyan',
  bunyanLogger: log
})
app.listenOptions = { host: '127.0.0.1', port: 1337 }

it('handles EACCESS error', () => {
  expect(errorHelperOut({ code: 'EACCES' }, app)).toMatchSnapshot()
})

it('handles error in production', () => {
  const http = new BaseServer({
    env: 'production',
    pid: 21384,
    nodeId: 'server:H1f8LAyzl',
    subprotocol: '2.5.0',
    supports: '2.x || 1.x',
    reporter: 'bunyan',
    bunyanLogger: log
  })
  http.listenOptions = { host: '127.0.0.1', port: 1000 }

  expect(errorHelperOut({ code: 'EACCES', port: 1000 }, http)).toMatchSnapshot()
})

it('handles EADDRINUSE error', () => {
  expect(errorHelperOut({
    code: 'EADDRINUSE',
    port: 1337
  }, app)).toMatchSnapshot()
})

it('throws on undefined error', () => {
  const e = {
    code: 'EAGAIN',
    message: 'resource temporarily unavailable'
  }
  function errorHelperThrow () {
    errorHelperOut(e, app)
  }
  expect(errorHelperThrow).toThrowError(/resource temporarily unavailable/)
})