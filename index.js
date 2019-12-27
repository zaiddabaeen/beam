const beam = require("./src/beam");
const minimist = require("minimist");
const { settings } = require("./src/settings");

module.exports = () => {
  const args = minimist(process.argv.slice(2), {
    alias: {
      'h' : 'remote-host',
      'p' : 'remote-path',
      'c' : 'cwd',
      'e' : 'extension',
      'i' : 'interval'
    }
  });

  if (args["v"]) {
    settings.debug = "v";
  }

  if (typeof args["h"] === "string") {
    settings.remoteHost = args["h"];
  }

  if (typeof args["p"] === "string") {
    settings.remotePath = args["p"];
  }

  if (typeof args["c"] === "string") {
    settings.filesCwd = args["c"];
  }

  if (typeof args["e"] === "string") {
    settings.fileExtension = args["e"];
  }

  if (typeof args["i"] === "number") {
    settings.interval = args["i"];
  }

  if (args["help"]) {
    console.log(`
beam --remote-host=<host> --remote-path=<path> <options>

-h --remote-host ......... Set the host to sync with, defaults to $BEAM_HOST
-p --remote-path ......... Set the path to sync with, defaults to $BEAM_REMOTE_PATH
-c --cwd ................. Set the current working directory for syncing, defaults to $BEAM_CWD then ./
-e --extension ........... Set the file extension to sync, defaults to $BEAM_EXT then all
-i --interval ............ Set the sync interval, defaults to 1000 (ms)
-v ....................... verbose logging
--help ................... show this help message

Structure for rsync files:
rsync -zR [file] [remote-host]:[remote-path]/[cwd]/

Example:
beam --remote-host=192.168.1.1 --remote-path=~/backend --cwd=src/ -e=.js

Would watch ${settings.fileExtension || 'all'} files from ${settings.localPath}
and sync them every ${settings.interval}ms relatively using
rsync -zR [file] 192.168.1.1:~/backend/src/`);
  } else {
    beam();
  }
};
