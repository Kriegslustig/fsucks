#!/usr/bin/env node

var fsucks = require('./lib/fsucks.js')

fsucks.getConf(process.cwd())
  .then(fsucks.getSourceDest.bind(null, process.argv, process.cwd()))
  .then(fsucks.sync)
  .catch((err) => console.error(err))

