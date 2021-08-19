const fs = require("fs").promises;
const _ = require("lodash");

/**
 * @param {Array} path - File paths to read from
 */
function getFiles(path) {
  return Promise.all(
    path.map(async (ele) => JSON.parse(await fs.readFile(ele, "utf-8")))
  ).then((data) => data.reduce((pre, cur) => [...pre, ...cur]));
}

/**
 * @param {Array} data - Objects which are user or job records
 * @param {Array} [jobKeys=["id", "title", "company", "tags"]] - Optional array of keys contained in job records
 * @param {Array} [userKeys=["id", "name", "tags"]] - Optional array of keys contained in user records
 */
function parseData(
  data,
  jobKeys = ["id", "title", "company", "tags"],
  userKeys = ["id", "name", "tags"]
) {
  const jobs = [];
  const users = [];

  if (typeof data === "object" && data.length > 0) {
    data.forEach((ele) => {
      if (_.difference(jobKeys, Object.keys(ele)).length === 0) {
        jobs.push(ele);
      } else if (_.difference(userKeys, Object.keys(ele)).length === 0) {
        users.push(ele);
      } else {
        throw new Error("Error SDSx3422: corrupt or incomplete data detected");
      }
    });
  }
  if (jobs.length === 0 || users.length === 0) {
    throw new Error("Error KILx2314: user or job data missing");
  }
  return { jobs, users };
}

/**
 * @param {Array} data - An array of objects containing at least a 'tags' property, which contain an array of strings
 */
function formTagsTable(data) {
  const tagsObj = {};

  data.forEach((ele, i) => {
    ele.tags.forEach((tag) => {
      if (tagsObj[tag] === undefined) {
        tagsObj[tag] = new Set([i]);
      } else {
        tagsObj[tag].add(i);
      }
    });
  });
  return tagsObj;
}

/**
 * @param {Array} users - An array of objects containing at least a 'tags' property, which contain an array of strings
 * @param {Array} jobs - An array of objects containing at least a 'tags' property, which contain an array of strings
 * @param {boolean} sort - Optional boolean, default true, disable sorting if false.
 * @param {number} minMatch - Optional nummber, default 1, minimal number of tags to match.
 */
function matchUserTagsToJobs(users, jobs, sort = false, minMatch = 1) {
  const matchedObj = {};
  const jobsByTagsTable = formTagsTable(jobs);

  users.forEach((user, i) => {
    const matchCounts = {};
    user.tags.forEach((tag) => {
      const match = jobsByTagsTable[tag];
      if (match !== undefined) {
        match.forEach((matchedIndex) => {
          if (matchCounts[matchedIndex] !== undefined) {
            matchCounts[matchedIndex] += 1;
          } else {
            matchCounts[matchedIndex] = 1;
          }
        });
      } else {
        matchCounts[matchedIndex] = 0;
      }
    });
    const matchedArr = Object.keys(matchCounts).reduce(
      (pre, cur) =>
        matchCounts[cur] >= minMatch ? [...pre, Number(cur)] : pre,
      []
    );
    if (matchedArr.length !== 0) {
      matchedObj[i] = new Set(matchedArr);
    }
    if (sort) {
      matchedObj[i] = new Set([...matchedObj[i]].sort((a, b) => a - b));
    }
  });

  return matchedObj;
}

/**
 * @param {array} users - An array of objects containing at least a 'tags' property, which contain an array of strings
 * @param {array} jobs - An array of objects containing at least a 'tags' property, which contain an array of strings
 * @param {object} matches - Object with key being the user index and value being an array of jobs indexes
 */
function printMatches(users, jobs, matches) {
  if (Object.keys(matches).length !== 0) {
    Object.entries(matches).forEach((user) => {
      user[1].forEach((match) => {
        console.log(
          `User ${users[user[0]].id} matched to ${JSON.stringify(jobs[match])}`
        );
      });
    });
  } else {
    console.log("No matches found.");
  }
}

module.exports = {
  parseData,
  getFiles,
  formTagsTable,
  matchUserTagsToJobs,
  printMatches,
};
