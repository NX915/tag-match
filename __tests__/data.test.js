const {
  parseData,
  formTagsTable,
  matchUserTagsToJobs,
  printMatches,
} = require("../data");
const users = [
  {
    id: 1,
    name: "Test User",
    tags: ["a", "b"],
  },
  {
    id: 2,
    name: "Test User2",
    tags: ["b", "c", "f"],
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
const userWithMinTwoMatchedJobs = {
  0: new Set([0]),
  1: new Set([0, 1]),
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
  test("Expect returned table contain sets as values", () => {
    const tagsTable = formTagsTable(jobs);
    expect(tagsTable[Object.keys(tagsTable)[0]]).toBeInstanceOf(Set);
  });
  test("Expect returned table to be correct", () => {
    expect(formTagsTable(jobs)).toMatchObject(jobsByTags);
  });
});

describe("matchUserTagsToJobs will return an array of user indexes and matching jobs' indexes in an array", () => {
  test("Expect returned object contain sets as values", () => {
    const matchTable = matchUserTagsToJobs(users, jobs);
    expect(matchTable[Object.keys(matchTable)[0]]).toBeInstanceOf(Set);
  });
  test("Expect returned object to be correct", () => {
    expect(matchUserTagsToJobs(users, jobs)).toMatchObject(userWithMatchedJobs);
  });
  test("Expect returned object to be correct when passed additional minimal 2 tag match requirnment", () => {
    expect(matchUserTagsToJobs(users, jobs, true, 2)).toMatchObject(
      userWithMinTwoMatchedJobs
    );
  });
});

describe("print and display the list of matches on the console", () => {
  test("Expect matches to be printed to console", () => {
    console.log = jest.fn();
    printMatches(users, jobs, userWithMinTwoMatchedJobs);
    expect(console.log).toHaveBeenCalledWith(
      'User 1 matched to {"id":1,"title":"Test developer","company":"Test industries","tags":["a","b","c"]}'
    );
    expect(console.log).toHaveBeenCalledWith(
      'User 2 matched to {"id":1,"title":"Test developer","company":"Test industries","tags":["a","b","c"]}'
    );
    expect(console.log).toHaveBeenCalledWith(
      'User 2 matched to {"id":2,"title":"Test tester","company":"Test company","tags":["c","b","d"]}'
    );
  });
  test("Expect match not found printed to console if matches are empty", () => {
    console.log = jest.fn();
    printMatches(users, jobs, {});
    expect(console.log).toHaveBeenCalledWith("No matches found.");
  });
});
