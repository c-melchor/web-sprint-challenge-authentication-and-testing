const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("../api/server");

test('sanity', () => {
  expect(true).toBe(true)
});

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});
beforeEach(async () => {
  await db('users').truncate()
});
afterAll(async () => {
  await db.destroy()
});

describe("register function", () => {
  describe("[POST] method", () => {
    it("returns a 201 when new user is registered", async () => {
      let res;
      res = await request(server).post("/api/auth/register").send({ username: "andrew", password: "1234" });
      expect(res.status).toBe(201)
    });
    // it("")
  });
});
