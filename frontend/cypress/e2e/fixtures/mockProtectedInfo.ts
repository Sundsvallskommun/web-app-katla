/**
 * Official test data for e2e tests.
 * Contains test personal identity numbers from the Swedish Tax Agency,
 * phone numbers from the Swedish Post and Telecom Authority (PTS),
 * and fake email addresses.
 * These are not linked to real individuals.
 */

export const mockProtectedInfo = {
  personNumbers: {
    valid: '199001012385', // Test personal identity number (Swedish Tax Agency)
    invalid: '199001012386', // Invalid test personal identity number
    nonexistent: '199909092380', // Nonexistent test personal identity number
  },
  organizationNumbers: {
    valid: '556026-9986', // Test organization number
    invalid: '556026-9987', // Invalid test organization number
  },
  emails: {
    user: 'a@example.com', // Not a real email
    recipient: 'mail@example.com', // Not a real email
  },
  phoneNumbers: {
    swedish: '0701740635', // PTS test number
    intl: '+46701740635', // PTS test number with country code
  },
  username: 'abc01abc', // Fake test user
  personId: 'aaaaaaa-bbbb-aaaa-bbbb-aaaabbbbcccc', // Fake personId
};
