const path = require('path');

const RUN_CONTROLLED = process.env.RUN_SCOUTHAWK_CONTROLLED === '1';
const CONTROLLED_TABLE_URL = process.env.SCOUTHAWK_CONTROLLED_TABLE_URL || '';
const RESUME_FILE = process.env.SCOUTHAWK_RESUME_FILE || path.resolve(__dirname, '../../files/resume.pdf');

function requireControlledConfig(test, requiredValues = {}) {
  test.skip(!RUN_CONTROLLED, 'Controlled test: set RUN_SCOUTHAWK_CONTROLLED=1 and use a disposable ScoutHawk table.');

  for (const [name, value] of Object.entries(requiredValues)) {
    test.skip(!value, `Controlled test config missing: ${name}`);
  }
}

module.exports = {
  CONTROLLED_TABLE_URL,
  RESUME_FILE,
  RUN_CONTROLLED,
  requireControlledConfig,
};
