# shieldgen

Update your package readme on every test with build status and code coverage.

(Because paying >1k a month for badges on private projects would be silly)

## Installation

Only supported with Jest.

1. Install as dev dependency:

```sh
npm i -D shieldgen
```

2. Set to run after jest in **package.json**

```json
"scripts": {
  "test": "jest --json --outputFile coverage/testResults.json && shieldgen"
},
```

3. Enable code coverage in **jest.config.js**:

```js
module.exports = {
  // ...
  collectCoverage: true,
  coverageReporters: ["html"]
};
```

## Configuration

Configuration for badge colors and messages, as well as optional Airtable integration is specified in **.shieldgen.config.json**. For integration, **AIRTABLE_API_KEY** must be set as an environment variable.

Here is an example configuration.

```json
{
  "readmePath": "readme.md",

  "testing": {
    "label": "build",
    "testStatusPath": "coverage/testResults.json",
    "pass": {
      "message": "passed",
      "color": "brightgreen"
    },
    "fail": {
      "message": "failed",
      "color": "red"
    }
  },

  "coverage": {
    "label": "coverage",
    "coveragePath": "coverage/index.html",
    "zeroCoverageColor": "ee4444",
    "fullCoverageColor": "22dd22"
  },

  "airtableIntegration": {
    "baseId": "appbHzsS9UBTiFabc",
    "tableName": "Repos",
    "nameColumn": "Name",
    "testStatusColumn": "Test Status",
    "coverageColumn": "Coverage"
  }
}
```