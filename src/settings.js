let settings = {
  debug: "info",
  remoteHost: process.env["BEAM_HOST"],
  localPath: process.env["BEAM_LOCAL_PATH"] || (process.cwd() + "/"),
  remotePath: process.env["BEAM_REMOTE_PATH"],
  filesCwd: process.env["BEAM_CWD"] || './',
  fileExtension: process.env["BEAM_EXT"] || '',
  interval: 5000,
};

module.exports = settings;
