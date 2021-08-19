const { parseData, formTagsTable, matchUserTagsToJobs } = require("../data");
const users = [
  {
    id: 1,
    name: "Test User",
    tags: ["a", "b"],
  },
  {
    id: 2,
    name: "Test User2",
    tags: ["b", "c"],
  },
];
const jobs = [
  {
    id: 1,
    title: "Test developer",
    company: "Test industries",
    tags: ["a", "b", "c"],
  },
  {
    id: 2,
    title: "Test tester",
    company: "Test company",
    tags: ["c", "b", "d"],
  },
  {
    id: 3,
    title: "Third tester",
    company: "Test incorprated",
    tags: ["c", "d", "e"],
  },
];
const data = [...users, ...jobs];
const jobsByTags = {
  a: new Set([0]),
  b: new Set([0, 1]),
  c: new Set([0, 1, 2]),
  d: new Set([1, 2]),
  e: new Set([2]),
};
const userWithMatchedJobs = {
  0: new Set([0, 1]),
  1: new Set([0, 1, 2]),
};

describe("parseData expected to separate user and job data from an array", () => {
  test("Expect error if given incorrect or corrupted data", () => {
    expect(() => parseData([...data, { bad: "data" }])).toThrow();
  });

  test("Expect user data to be extracted", () => {
    expect(parseData(data).users[0]).toEqual(expect.objectContaining(users[0]));
  });

  test("Expect user data to be extracted with extra incoming data fields", () => {
    expect(
      parseData([{ ...users[0], extra: "data" }, ...jobs]).users[0]
    ).toEqual(expect.objectContaining(users[0]));
  });

  test("Expect job data to be extracted", () => {
    expect(parseData(data).jobs[0]).toEqual(expect.objectContaining(jobs[0]));
  });

  test("Expect job data to be extracted with extra incoming data fields", () => {
    expect(
      parseData([{ ...jobs[0], extra: "data" }, ...users]).jobs[0]
    ).toEqual(expect.objectContaining(jobs[0]));
  });
});

describe("formTagsTable expected to map a list of unique tags and record indexes matching those tags", () => {
  test("Expect returned table to be correct", () => {
    expect(formTagsTable(jobs)).toMatchObject(jobsByTags);
  });
});

describe("matchUserTagsToJobs will return an array of user id and array of jobs' indexes", () => {
  test("Expect returned object to be correct", () => {
    expect(matchUserTagsToJobs(users, jobs)).toMatchObject(userWithMatchedJobs);
  });
});
