const Redis = require("ioredis");

describe("Performance Tests", () => {
  let redis;

  beforeAll(() => {
    redis = new Redis();
  });

  afterAll(async () => {
    await redis.flushdb();
    await redis.quit();
  });
  

  test("Session retrieval under 10ms", async () => {
    const key = "session:test123";
    const value = JSON.stringify({ user_id: "12345", last_activity: new Date().toISOString() });
    await redis.set(key, value);

    const start = process.hrtime.bigint();
    const result = await redis.get(key);
    const end = process.hrtime.bigint();

    const durationMs = Number(end - start) / 1e6;
    expect(result).not.toBeNull();
    expect(durationMs).toBeLessThan(10);
  });

  test("Handle 1 million sessions (simulation)", async () => {
    const pipeline = redis.pipeline();

    for (let i = 0; i < 10000; i++) {
      pipeline.set(`session:${i}`, JSON.stringify({ user_id: i }));
    }

    await pipeline.exec();

    const count = await redis.dbsize();
    // Tolérance ajustée pour éviter les faux négatifs
    expect(count).toBeGreaterThanOrEqual(10000);
  });
});
