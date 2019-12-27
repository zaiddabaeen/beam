const { settings } = require("./settings");

function log(message, ...optionalParams) {
  const date = (new Date()).toISOString();

  if (optionalParams.length) {
    console.log(`[${date}] ${message}`, ...optionalParams);
  } else {
    console.log(`[${date}] ${message}`);
  }
}

function vlog(message, ...optionalParams) {
  if (settings.debug === "v") {
    log(message, ...optionalParams);
  }
}

module.exports = { log, vlog };
