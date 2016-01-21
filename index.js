'use strict'

var keypress = require('keypress')
var chalk = require('chalk')
var log = require('single-line-log').stdout

module.exports = function (title, cb) {
  var items = []
  var isRaw = process.stdin.isRaw
  var active = true
  var selected = 0

  keypress(process.stdin)
  process.stdin.on('keypress', onkeypress)
  if (!isRaw) process.stdin.setRawMode(true)
  process.stdin.resume()
  draw()

  function add (item) {
    if (!active) return
    if (typeof item === 'string') item = { name: item, value: item }
    items.push(item)
    draw()
  }

  function onkeypress (ch, key) {
    if (!key) return
    if (key.ctrl && key.name === 'c') process.exit(130)
    if (key.name === 'up') {
      if (selected === 0) return
      selected--
      draw()
    } else if (key.name === 'down') {
      if (selected >= items.length - 1) return
      selected++
      draw()
    } else if (key.name === 'return') {
      select()
    }
  }

  function select () {
    active = false
    process.stdin.pause()
    if (!isRaw) process.stdin.setRawMode(false)
    process.stdin.removeListener('keypress', onkeypress)
    cb(items[selected].value)
  }

  function draw () {
    log(items.reduce(function (s, item, index) {
      return s + (index === selected ? chalk.cyan('> ' + item.name) : '  ' + item.name) + '\n'
    }, chalk.green('? ') + chalk.bold(title) + '\n'))
  }

  return { add: add }
}
