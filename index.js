const args = process.argv.splice(2);
const { getFiles, parseData } = require("./data.js");

if (args.length <= 1) {
  console.log("Missing launch parameters, program exiting...");
} else {
  getFiles(args).then((data) => {
    const { jobs, users } = parseData([...data[0], ...data[1]]);
    console.log("users: ", users);
    console.log("jobs: ", jobs);
  });
}
