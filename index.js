#!/usr/bin/env node
const args = process.argv.splice(2);
const { getFiles, parseData, matchUserTagsToJobs } = require("./data.js");

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
      if (jobs.length !== 0 && users.length !== 0) {
        const userMatches = matchUserTagsToJobs(users, jobs, false, minMatch);
        if (Object.keys(userMatches).length !== 0) {
          Object.entries(userMatches).forEach((user) => {
            user[1].forEach((match) => {
              console.log(
                `User ${users[user[0]].id} matched to ${JSON.stringify(
                  jobs[match]
                )}`
              );
            });
          });
        } else {
          console.log("No matches found.");
        }
      } else {
        console.log("User or job data not found, program exiting...");
      }
    })
    .catch((e) => console.log("An error occurred: ", e.message));
}

