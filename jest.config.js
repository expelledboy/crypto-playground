module.exports = {
  verbose: true,
  roots: ["src"],
  transform: { "^.+\\.(t|j)sx?$": ["@swc/jest"] },
}
