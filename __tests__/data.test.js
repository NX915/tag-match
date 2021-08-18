const { parseData } = require("../data");
const user = {
  id: 1,
  name: "Test User",
  tags: ["a", "b"],
};
const job = {
  id: 1,
  title: "Test developer",
  company: "Test industries",
  tags: ["a", "b", "c"],
};
const data = [user, job];

describe("parseData expected to separate user and job data from an array", () => {
  test("Expect error if given incorrect or corrupted data", () => {
    expect(() => parseData([...data, { bad: "data" }])).toThrow();
  });

  test("Expect user data to be extracted", () => {
    expect(parseData(data).users[0]).toEqual(expect.objectContaining(user));
  });

  test("Expect user data to be extracted with extra incoming data fields", () => {
    expect(parseData([{ ...user, extra: "data" }, job]).users[0]).toEqual(
      expect.objectContaining(user)
    );
  });

  test("Expect job data to be extracted", () => {
    expect(parseData(data).jobs[0]).toEqual(expect.objectContaining(job));
  });

  test("Expect job data to be extracted with extra incoming data fields", () => {
    expect(parseData([{ ...job, extra: "data" }, user]).jobs[0]).toEqual(
      expect.objectContaining(job)
    );
  });
});

describe("form tagTable expected to form a list of unqiue tags and record matching those tags", () => {});
