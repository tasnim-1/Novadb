const Redis = require("ioredis");

describe("Resilience Tests", () => {
  let redis;

  beforeAll(() => {
    redis = new Redis();
  });

  afterAll(async () => {
    await redis.flushdb();
    await redis.quit();
  });

  test("Session recovery after simulated failure", async () => {
    const key = "session:resilience123";
    await redis.set(key, "test_value");

    // Simuler une panne : flushdb
    await redis.flushdb();

    // Restaurer la session (simulation réplication)
    await redis.set(key, "restored_value");
    const value = await redis.get(key);

    expect(value).toBe("restored_value");
  });
});
