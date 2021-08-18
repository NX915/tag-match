const { parseData } = require("../data");
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
];
const data = [...users, ...jobs];

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

describe("formTagTable expected to form a list of unique tags and records matching those tags", () => {});
