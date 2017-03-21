'use strict'

const spawn = require('child_process').spawn
const path = require('path')

const Server = require('../server')

const DATE = /\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/g

function wait (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

let started

function start (name, args) {
  return new Promise(resolve => {
    started = spawn(path.join(__dirname, '/servers/', name), args)
    let running = false
    function callback () {
      if (!running) {
        running = true
        resolve()
      }
    }
    started.stdout.on('data', callback)
    started.stderr.on('data', callback)
  })
}

function test (name, args) {
  return new Promise(resolve => {
    let out = ''
    const server = spawn(path.join(__dirname, '/servers/', name), args)
    server.stdout.on('data', chank => {
      out += chank
    })
    server.stderr.on('data', chank => {
      out += chank
    })
    server.on('close', exitCode => {
      let fixed = out.replace(DATE, '1970-01-01 00:00:00')
                     .replace(/PID:(\s+)\d+/, 'PID:$121384')
                     .replace(/"pid":\d+,/g, '"pid":21384,')
                     .replace(
                       /"hostname":"[-.\w]+",/g,
                       '"hostname":"localhost",'
                     )
                     .replace(
                       /"time":"[-.:\dTZ]+",/g,
                       '"time":"1970-01-01T00:00:00.000Z",'
                     )
      fixed = fixed.replace(/\r\v/g, '\n')
      resolve([fixed, exitCode])
    })
    wait(500).then(() => {
      server.kill('SIGINT')
    })
  })
}

function checkOut (name, args) {
  return test(name, args).then(result => {
    const out = result[0]
    const exit = result[1]

    if (exit !== 0) {
      console.error(`${ test } fall with:\n${ out }`)
    }
    expect(exit).toEqual(0)
    expect(out).toMatchSnapshot()
  })
}

function checkError (name, args) {
  return test(name, args).then(result => {
    const out = result[0]
    const exit = result[1]
    expect(exit).toEqual(1)
    expect(out).toMatchSnapshot()
  })
}

const originEnv = process.env.NODE_ENV
afterEach(() => {
  process.env.NODE_ENV = originEnv
  delete process.env.LOGUX_PORT
  if (started) {
    started.kill('SIGINT')
    started = undefined
  }
})

it('uses cli args for options', () => {
  const options = Server.loadOptions({
    argv: ['', '--port', '31337', '--host', '192.168.1.1'],
    env: { }
  })

  expect(options.host).toEqual('192.168.1.1')
  expect(options.port).toEqual(31337)
  expect(options.cert).toBeUndefined()
  expect(options.key).toBeUndefined()
})

it('uses env for options', () => {
  const options = Server.loadOptions({
    argv: [],
    env: { LOGUX_HOST: '127.0.1.1', LOGUX_PORT: 31337 }
  })

  expect(options.host).toEqual('127.0.1.1')
  expect(options.port).toEqual(31337)
})

it('uses combined options', () => {
  const options = Server.loadOptions({
    env: { LOGUX_CERT: './cert.pem' },
    argv: ['', '--key', './key.pem']
  }, { port: 31337 })

  expect(options.port).toEqual(31337)
  expect(options.cert).toEqual('./cert.pem')
  expect(options.key).toEqual('./key.pem')
})

it('uses arg, env, options in given priority', () => {
  const options1 = Server.loadOptions({
    argv: ['', '--port', '31337'],
    env: { LOGUX_PORT: 21337 }
  }, { port: 11337 })
  const options2 = Server.loadOptions({
    argv: ['', '--port', '31337'],
    env: { LOGUX_PORT: 21337 }
  })
  const options3 = Server.loadOptions({
    argv: [],
    env: { LOGUX_PORT: 21337 }
  })

  expect(options1.port).toEqual(11337)
  expect(options2.port).toEqual(31337)
  expect(options3.port).toEqual(21337)
})

it('destroys everything on exit', () => checkOut('destroy.js'))

it('reports unbind', () => test('unbind.js').then(result => {
  expect(result[0]).toMatchSnapshot()
}))

it('shows uncatch errors', () => checkError('throw.js'))

it('shows uncatch rejects', () => checkError('uncatch.js'))
it('shows uncatch rejects1', () => checkError('uncatch.js'))
it('shows uncatch rejects2', () => checkError('uncatch.js'))
it('shows uncatch rejects3', () => checkError('uncatch.js'))
it('shows uncatch rejects4', () => checkError('uncatch.js'))
it('shows uncatch rejects5', () => checkError('uncatch.js'))
it('shows uncatch rejects6', () => checkError('uncatch.js'))
it('shows uncatch rejects7', () => checkError('uncatch.js'))
it('shows uncatch rejects8', () => checkError('uncatch.js'))
it('shows uncatch rejects9', () => checkError('uncatch.js'))
it('shows uncatch rejects10', () => checkError('uncatch.js'))
it('shows uncatch rejects11', () => checkError('uncatch.js'))
it('shows uncatch rejects12', () => checkError('uncatch.js'))
it('shows uncatch rejects13', () => checkError('uncatch.js'))
it('shows uncatch rejects14', () => checkError('uncatch.js'))
it('shows uncatch rejects15', () => checkError('uncatch.js'))
it('shows uncatch rejects16', () => checkError('uncatch.js'))
it('shows uncatch rejects17', () => checkError('uncatch.js'))
it('shows uncatch rejects18', () => checkError('uncatch.js'))
it('shows uncatch rejects19', () => checkError('uncatch.js'))
it('shows uncatch rejects20', () => checkError('uncatch.js'))
it('shows uncatch rejects21', () => checkError('uncatch.js'))
it('shows uncatch rejects22', () => checkError('uncatch.js'))
it('shows uncatch rejects23', () => checkError('uncatch.js'))
it('shows uncatch rejects24', () => checkError('uncatch.js'))
it('shows uncatch rejects25', () => checkError('uncatch.js'))
it('shows uncatch rejects26', () => checkError('uncatch.js'))
it('shows uncatch rejects27', () => checkError('uncatch.js'))
it('shows uncatch rejects28', () => checkError('uncatch.js'))
it('shows uncatch rejects29', () => checkError('uncatch.js'))
it('shows uncatch rejects30', () => checkError('uncatch.js'))
it('shows uncatch rejects31', () => checkError('uncatch.js'))
it('shows uncatch rejects32', () => checkError('uncatch.js'))
it('shows uncatch rejects33', () => checkError('uncatch.js'))
it('shows uncatch rejects34', () => checkError('uncatch.js'))
it('shows uncatch rejects35', () => checkError('uncatch.js'))
it('shows uncatch rejects36', () => checkError('uncatch.js'))
it('shows uncatch rejects37', () => checkError('uncatch.js'))
it('shows uncatch rejects38', () => checkError('uncatch.js'))
it('shows uncatch rejects39', () => checkError('uncatch.js'))
it('shows uncatch rejects40', () => checkError('uncatch.js'))
it('shows uncatch rejects41', () => checkError('uncatch.js'))
it('shows uncatch rejects42', () => checkError('uncatch.js'))
it('shows uncatch rejects43', () => checkError('uncatch.js'))
it('shows uncatch rejects44', () => checkError('uncatch.js'))
it('shows uncatch rejects45', () => checkError('uncatch.js'))
it('shows uncatch rejects46', () => checkError('uncatch.js'))
it('shows uncatch rejects47', () => checkError('uncatch.js'))
it('shows uncatch rejects48', () => checkError('uncatch.js'))
it('shows uncatch rejects49', () => checkError('uncatch.js'))
it('shows uncatch rejects50', () => checkError('uncatch.js'))

it('use environment variables for config', () => {
  process.env.LOGUX_PORT = 31337
  return checkOut('options.js')
})

it('shows help', () => checkOut('options.js', ['', '--help']))

it('shows help about port in use', () => start('eaddrinuse.js')
  .then(() => test('eaddrinuse.js')).then(result => {
    expect(result[0]).toMatchSnapshot()
  }))

it('shows help about privileged port', () => checkError('eacces.js'))

it('reports to bunyan log', () => checkOut('bunyan.js'))

it('reports to custom bunyan log', () => checkOut('bunyan-custom.js'))
