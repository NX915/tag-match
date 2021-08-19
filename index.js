#!/usr/bin/env node
const args = process.argv.splice(2);
const {
  getFiles,
  parseData,
  matchUserTagsToJobs,
  printMatches,
} = require("./data.js");

if (args.length <= 0) {
  console.log("Missing launch parameters, program exiting...");
} else {
  let minMatch = 2;
  if (new RegExp(/-\d+/).test(args[0])) {
    minMatch = Math.abs(parseInt(args[0]));
    args.shift();
  }
  getFiles(args)
    .then((data) => {
      const { jobs, users } = parseData(data);
      const userMatches = matchUserTagsToJobs(users, jobs, false, minMatch);
      printMatches(users, jobs, userMatches);
    })
    .catch((e) => console.log("An error occurred: ", e.message));
}

