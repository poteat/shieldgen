/* eslint-disable no-console */
import { readFileSync, writeFileSync } from "fs";
import * as _ from "lodash";
import airtable from "airtable";
import { hexColorLinterp } from "hex-color-linterp";
import { Config } from "./config";

const config: Config = JSON.parse(
  readFileSync("./.shieldgen.config.json", "utf8")
);

const jestCoverageExtractor = /^[^]*?<span class="strong">(.*?)%/g;
const jestResultFilePassedStatus = "passed";
const packageFilePath = "package.json";

const files = _.mapValues(
  {
    package: packageFilePath,
    readme: config.readmePath,
    coverageFile: config.coverage.coveragePath,
    buildFile: config.testing.testStatusPath
  },
  s => readFileSync(s, "utf8")
);

const buildStatus = _.every(
  JSON.parse(files.buildFile).testResults,
  x => x.status === jestResultFilePassedStatus
)
  ? config.testing.pass.message
  : config.testing.fail.message;

const coverage = Number(jestCoverageExtractor.exec(files.coverageFile)[1]); // e.g. 87.333333
const coverageRounded = Math.floor(coverage * 10) / 10; // e.g. 87.3
const coverageString = `${coverageRounded.toFixed(1)}%`; // e.g. "87.3%"

const packageName = `${JSON.parse(files.package).name}`;

const shield = (label: string, message: string, color: string) =>
  `![](https://img.shields.io/static/v1.svg?label=${label}&message=${message}&color=${color})`;

const readmeUpdated: string = files.readme.replace(
  /^.*/,
  `# ${packageName} ${shield(
    config.testing.label,
    buildStatus,
    buildStatus === config.testing.pass.message
      ? config.testing.pass.color
      : config.testing.fail.color
  )} ${shield(
    config.coverage.label,
    coverageString,
    hexColorLinterp(
      coverage / 100,
      config.coverage.zeroCoverageColor,
      config.coverage.fullCoverageColor
    )
  )}`
);

writeFileSync(config.readmePath, readmeUpdated);

if (config.airtableIntegration) {
  const base = new airtable().base(config.airtableIntegration.baseId);
  const shortPackageName = packageName.replace(/^@.+?\//, "");
  const at = config.airtableIntegration;

  base(at.tableName)
    .select({
      fields: [at.nameColumn],
      filterByFormula: `{${at.nameColumn}} = "${shortPackageName}"`
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach(record => {
        base(at.tableName)
          .update(record.id, {
            [at.testStatusColumn]: _.capitalize(buildStatus),
            [at.coverageColumn]: coverage / 100
          })
          .catch(err => console.error(err));
      });
      fetchNextPage();
    })
    .catch(err => console.log(err));
}
