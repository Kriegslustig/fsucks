var fs = require('fs')
var path = require('path')
var Promise = require('promise')
var Rsync = require('rsync')

module.exports = {
  sync (pipe) {
    return new Promise((res, rej) => {
    (new Rsync().flags('rqlt').source(pipe[0]).destination(pipe[1]))
      .execute(function (err, code) {
        if (err) return rej(arguments)
        res()
      })
    })
  },
  getConf (pwd) {
    return new Promise((res, rej) => {
      var currentConf = path.join(pwd, 'fsucks.json')
      fs.stat(currentConf, (err, stat) => {
        var newPath
        if (!err && stat.isFile()) {
          fs.readFile(currentConf, (err, data) => {
            var conf
            if (err) rej(err)
             conf = JSON.parse(data)
            conf.local = pwd
            res(conf)
          })
        } else {
          newPath = path.normalize(path.join(pwd, '..'))
          if (newPath === pwd) return rej('No fsucks.json file found')
          this.getConf(newPath)
            .then(res)
            .catch(rej)
        }
      }, rej)
    })
  },
  getSourceDest (argv, pwd, conf) {
    return new Promise((res, rej) => {
      var pathDiff = pwd.replace(path.normalize(conf.local) + '/', '')
      var relPath = `${pathDiff}/${argv[3]}`
      var auth = conf.password
        ? `:${conf.password}`
        : ''
      var local = `${conf.local}/${relPath}`
      var remote =  `${conf.user}${auth}@${conf.server}:${conf.remote}/${relPath}`
      switch (argv[2]) {
        case 'put':
          return res([local, remote])
        case 'get':
          return res([remote, local])
        default:
          rej('Not an action')
      }
    })
  }
}


