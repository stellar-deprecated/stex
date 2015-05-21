var Initializer = require("../initializer");
var path = require('path');
var _ = require('lodash');

Initializer.add('startup', 'stex.heapdump', function(stex) {
  var heapDir = process.env.HEAPDUMP_DIR;
  if (_.isEmpty(heapDir)) {
    heapDir = process.cwd();
  }
  // ensure heapdump doesn't install its default handler
  // since we will write our own
  process.env.NODE_HEAPDUMP_OPTIONS = "nosignal";
  var heapdump = require("heapdump");

  
  process.on('SIGUSR2', function() {
    fileName = "pid-" + process.pid + "-" + (new Date().toISOString()) + ".heapsnapshot";
    dumpPath = path.join(heapDir, fileName);
    heapdump.writeSnapshot(dumpPath);
  });
});


