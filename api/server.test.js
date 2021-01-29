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

    it("validates registration information is complete", async () => {
      let res
      res = await request(server).post("/api/auth/register").send({ username: "", password: "1234" })
      expect(res.status).toBe(400);
    });
  });
});

describe("login function", () => {
  describe("[POST] method", () => {
    it("doesn't allow someone to login if no token present", async () => {
      let res;
      res = await request(server).post("/api/auth/login").send({ username: "hello", password: "there" });
      expect(res.status).toBe(401);
    });

    it("validates login information is complete", async () => {
      let res
      res = await request(server).post("/api/auth/login").send({ username: "christina", password: "" })
      expect(res.status).toBe(400);
    });

    it("receives a token on authorized login", async () => {
      let maa = { username: "maa", password: "1234" };
      await request(server).post("/api/auth/register").send(maa);
      res = await request(server).post("/api/auth/login").send(maa);
      expect(res.body).toMatchObject({ message: "welcome, maa", token: res.body.token });
    });
  });

  describe("[GET] method for dad jokes", () => {
    it("doesn't allow dad jokes to be seen without a valid token", async () => {
      let res;
      res = await request(server).get("/api/jokes");
      expect(res.status).toBe(401)
    });

    it("allows authorized user to [GET] jokes", async () => {
      let maa = { username: "maa", password: "1234" };
      await request(server).post("/api/auth/register").send(maa);
      res = await request(server).post("/api/auth/login").send(maa);
      token = res.body.token;
      expect(res.body).toMatchObject({ message: "welcome, maa", token: token });
      let jokes = await request(server).get("/api/jokes").set("Authorization", token)
      expect(jokes.body).toBeDefined()
    });
  });

});
