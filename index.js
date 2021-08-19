#!/usr/bin/env node
const args = process.argv.splice(2);
const { getFiles, parseData, matchUserTagsToJobs } = require("./data.js");

if (args.length <= 0) {
  console.log("Missing launch parameters, program exiting...");
} else {
  getFiles(args).then((data) => {
    const { jobs, users } = parseData(data);
    if (jobs.length !== 0 && users.length !== 0) {
      const userMatches = matchUserTagsToJobs(users, jobs);
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
      console.log("User or job data not found, program exiting...");
    }
  });
}
