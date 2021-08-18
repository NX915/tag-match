const fs = require("fs/promises");
const _ = require("lodash");

function getFiles(path) {
  return Promise.all(
    path.map(async (ele) => JSON.parse(await fs.readFile(ele, "utf-8")))
  );
}

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

module.exports = { parseData, getFiles };
