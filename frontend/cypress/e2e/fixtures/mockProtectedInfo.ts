/**
 * Officiell testdata för e2e-tester.
 * Innehåller testpersonnummer från Skatteverket, telefonnummer från PTS och fejkade e-postadresser.
 * Dessa är ej kopplade till riktiga personer.
 */

export const mockProtectedInfo = {
  personNumbers: {
    valid: '199001012385', // Testpersonnummer (Skatteverket)
    invalid: '199001012386', // Ogiltigt testpersonnummer
    nonexistent: '199909092380', // Ej existerande testpersonnummer
  },
  organizationNumbers: {
    valid: '556026-9986', // Test org.nr
    invalid: '556026-9987', // Ogiltigt test org.nr
  },
  emails: {
    user: 'a@example.com', // Ej riktig e-post
    recipient: 'mail@example.com', // Ej riktig e-post
  },
  phoneNumbers: {
    swedish: '0701740635', // PTS-testnummer
    intl: '+46701740635', // PTS-testnummer med landskod
  },
  username: 'abc01abc', // Fejkad testanvändare
  personId: 'aaaaaaa-bbbb-aaaa-bbbb-aaaabbbbcccc', //Fejkad personId
};
