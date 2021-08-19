const fs = require("fs/promises");
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
 */
function matchUserTagsToJobs(users, jobs, sort = true) {
  const matchedObj = {};
  const jobsByTagsTable = formTagsTable(jobs);

  users.forEach((user, i) => {
    user.tags.forEach((tag) => {
      const match = jobsByTagsTable[tag];
      if (match !== undefined) {
        match.forEach((matchedIndex) => {
          if (matchedObj[i] !== undefined) {
            matchedObj[i].add(matchedIndex);
          } else {
            matchedObj[i] = new Set([matchedIndex]);
          }
        });
      }
    });
    if (sort) {
      matchedObj[i] = new Set([...matchedObj[i]].sort((a, b) => a - b));
    }
  });

  return matchedObj;
}

module.exports = { parseData, getFiles, formTagsTable, matchUserTagsToJobs };
