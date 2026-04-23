module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"], // ne teste que le backend
  transform: {}, // pas de Babel pour backend
};
