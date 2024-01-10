export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  rootDir: "src",
  setupFiles: ["<rootDir>/__config__/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__config__/fileMock.js",
    "^.+\\.(css)$": "<rootDir>/__config__/CSSStub.js",
    "use-resize-observer": "use-resize-observer/polyfilled",
  },
};
