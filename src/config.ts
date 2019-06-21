export interface Config {
  readmePath: string;

  testing: {
    label: string;
    testStatusPath: string;
    pass: {
      message: string;
      color: string;
    };
    fail: {
      message: string;
      color: string;
    };
  };

  coverage: {
    label: string;
    coveragePath: string;
    zeroCoverageColor: string;
    fullCoverageColor: string;
  };

  airtableIntegration?: {
    baseId: string;
    tableName: string;
    nameColumn: string;
    testStatusColumn: string;
    coverageColumn: string;
  };
}
