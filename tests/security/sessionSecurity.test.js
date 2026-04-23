const Redis = require("ioredis");
const crypto = require("crypto");

describe("Security Tests", () => {
  let redis;
  let cipherKey;

  beforeAll(() => {
    redis = new Redis();
    cipherKey = crypto.randomBytes(32); // AES-256
  });

  afterAll(async () => {
    await redis.flushdb();
    await redis.quit();
  });

  function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", cipherKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), data: encrypted };
  }

  function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", cipherKey, iv);
    let decrypted = decipher.update(encrypted.data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  test("Session data is encrypted", async () => {
    const key = "session:secure123";
    const sensitiveData = "user_id=12345";
    const encrypted = encrypt(sensitiveData);

    await redis.set(key, JSON.stringify(encrypted));
    const stored = JSON.parse(await redis.get(key));

    expect(stored.data).not.toEqual(sensitiveData);
    const decrypted = decrypt(stored);
    expect(decrypted).toEqual(sensitiveData);
  });
});
