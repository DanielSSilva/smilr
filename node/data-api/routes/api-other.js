const express = require('express');
const routes = express.Router();
const uuidv4 = require('uuid/v4');
const os = require('os');
const fs = require('fs');

// Misc routes

routes
.get('/api/info', function (req, res, next) {
  res.type('application/json');
  var info = { 
    hostname: os.hostname(), 
    container: fs.existsSync('/.dockerenv'), 
    osType: os.type(), 
    osRelease: os.release(), 
    arch: os.arch(),
    cpuModel: os.cpus()[0].model, 
    cpuCount: os.cpus().length, 
    memory: Math.round(os.totalmem() / 1048576),
    nodeVer: process.version,
  }  
  res.send(info);
})

// Global catch all for all requests not caught by other routes
// Just return a HTTP 400
.get('*', function (req, res, next) {
  res.sendStatus(400);
})

module.exports = routes;
