settings = {
  debug: "info",
  remoteHost: null,
  localPath: process.cwd() + "/",
  remotePath: null,
  filesCwd: '',
  fileExtension: '',
  interval: 1000,
  fsWatchInterval: 500,
};

let applyEnv = function() {
  if (!settings.remoteHost) {
    Object.assign(settings, {
      remoteHost: process.env["BEAM_HOST"],
      localPath: process.env["BEAM_LOCAL_PATH"] || (process.cwd() + "/"),
      remotePath: process.env["BEAM_REMOTE_PATH"],
      filesCwd: process.env["BEAM_CWD"] || '',
      fileExtension: process.env["BEAM_EXT"] || '',
    });
  }
}

module.exports = {settings, applyEnv};
