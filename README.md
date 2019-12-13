# Beam

Watch files using `fswatch` and sync them using `rsync` with a remote server.

## Installation

```
npm install
```

## Usage

```
beam --remote-host=<host> --remote-path=<path> <options>

-h --remote-host ......... Set the host to sync with, defaults to $BEAM_HOST
-p --remote-path ......... Set the path to sync with, defaults to $BEAM_REMOTE_PATH
-c --cwd ................. Set the current working directory for syncing, defaults to $BEAM_CWD then ./
-e --extension ........... Set the file extension to sync, defaults to $BEAM_EXT then all
-i --interval ............ Set the sync interval, defaults to 5000 (ms)
-v ....................... verbose logging
--help ................... show this help message

Structure for rsync files:
rsync -zR [file] [remote-host]:[remote-path]/[cwd]/

Example:
beam --remote-host=192.168.1.1 --remote-path=~/backend --cwd=src/ -e=.js

Would watch .go files from /Users/zaiddabaeen/
and sync them every 5000ms relatively using
rsync -zR [file] 192.168.1.1:~/backend/src/
```

## Motivation

Working on a machine and building the same project on another machine requires either constant pushing/pulling from git or manual copy paste. Most of the available packages available did not yield the results as fast or accurate as I needed, so I created `beam`.