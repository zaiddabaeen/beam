const fs = require("fs");
const Rsync = require("rsync");
const { log, vlog } = require("./log");
const {settings, applyEnv} = require("./settings");

module.exports = () => {
  applyEnv();

  const remoteHost = settings.remoteHost;
  if (!remoteHost) {
    throw Error(
      "BEAM_HOST not defined. See --help or export it to env variables with" +
        "\necho -e 'export BEAM_HOST=zed.desktop' | tee -a ~/.profile\nsource ~/.profile\n\n"
    );
  }

  const remotePath = settings.remotePath;
  if (!remotePath) {
    throw Error(
      "BEAM_REMOTE_PATH not defined. See --help or export it to env variables with" +
      "\necho -e 'export BEAM_REMOTE_PATH=~/code' | tee -a ~/.profile\nsource ~/.profile\n\n"
    );
  }

  const localPath = settings.localPath;

  const rootDestinationPath = remoteHost + ":" + remotePath;
  const filesPath = settings.filesCwd;
  const extensions = settings.fileExtension.split(',');
  const path = localPath + filesPath;

  log(`Syncing with ${remoteHost}`);
  vlog(`Syncing files from ${path} using command:\nrsync -zR [file] ${rootDestinationPath}${filesPath}`);

  const filesChanged = new Set();

  function includesFilesByExtension(files) {
    if (extensions.length === 1) {
      return files.filter(f => f.endsWith(settings.fileExtension));
    } else if (extensions.length > 1) {
      return files.filter(f => {
        let keep = false;
        for (let ext of extensions) {
          if (f.endsWith(ext)) {
            keep = true;
            break;
          }
        }
        return keep;
      });
    }
    return files.filter(v => v.endsWith(settings.fileExtension));
  }

  function excludeByStartWith(files) {
    return files.filter(v => !v.startsWith(".git"));
  }

  function excludeFilesByExtension(files) {
    return files.filter(v => !v.endsWith("~"));
  }

  function runRsync() {
    let files = includesFilesByExtension([...filesChanged]);
    files = excludeByStartWith([...files]);
    files = excludeFilesByExtension([...files]);

    const rsync = new Rsync()
      .flags("zR", true)// // z: compress, R: relative
      .destination(rootDestinationPath + filesPath);

    rsync.cwd(path);

    if (files.length > 0) {
      files.forEach(f => {
        rsync.source(f);
      });
      rsync.execute((err, code, cmd) => {
        if (err) {
          log("Error: " + err);
          log("Code: " + code);
          log("Command: " + cmd);
          log("");
        }

        log("Synced", files.join(" "));
        vlog(cmd + "\n");
      });
    }

    filesChanged.clear();
  }

  function performInitialSync() {
    const rsync = new Rsync()
      .flags("zrRcn", true) // z: compress, r: recursive, R: relative, c: checksum
      .exclude(['.git', '.DS_Store'])
      .destination(rootDestinationPath + filesPath);

    if (extensions.length) {
      extensions.forEach((e) => {
        rsync.include(e);
      });
    }

    rsync.cwd(path);

    rsync.execute((err, code, cmd) => {
      if (err) {
        log("Error: " + err);
        log("Code: " + code);
        log("Command: " + cmd);
        log("");
      }

      log("Initially Synced");
      vlog(cmd + "\n");
    });
  }

  if (settings.syncInitial) {
    performInitialSync();
  }

  fs.watch(
    filesPath || './',
    {
      recursive: true,
      interval: settings.fsWatchInterval
    },
    (event, filename) => {
      filesChanged.add(filename);
    }
  );

  setInterval(runRsync, settings.interval);
};
