/// <reference types="cypress" />

import { FTCaseLabel, FTCaseType } from '@interfaces/case-type';
import { Role, RoleDisplayNames } from '@interfaces/role';
import { mockAddressResponse } from './fixtures/mockAddressRespons';
import { mockAdUser } from './fixtures/mockAdUser';
import { mockErrands_FT_draft } from './fixtures/mockErrands';
import { mockMe } from './fixtures/mockMe';
import { mockNotifications } from './fixtures/mockNotifications';
import { mockProtectedInfo } from './fixtures/mockProtectedInfo';

export const MOCK_INVALID_SEARCH = 'Ej giltigt personnummer (ange tolv siffror: ååååmmddxxxx)';

describe('Registrera ärende-sida', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/me', mockMe).as('getMe');
    cy.intercept('GET', '**/casedatanotifications/**', mockNotifications).as('getNotifications');
    cy.intercept('GET', '**/healthcarestaff/**', mockAdUser).as('getAdUser');
    cy.intercept('GET', '**/portalpersondata/PERSONAL/**', (req) => {
      req.reply(mockAdUser);
    }).as('getAdUser');
    cy.visit('/registrera');

    cy.wait('@getAdUser');
    cy.wait('@getMe');

    cy.get('body').then(($body) => {
      if ($body.find('.sk-cookie-consent-btn-wrapper').length) {
        cy.get('.sk-cookie-consent-btn-wrapper').contains('Godkänn alla').click();
      }
    });
    cy.intercept('POST', '/api/address', {
      statusCode: 200,
      body: mockAddressResponse,
    }).as('postAddress');
  });

  it('displays the base form correctly', () => {
    cy.contains('h1', 'Nytt ärende').should('exist');

    cy.get('h2').contains('Grundinformation').should('exist');
    cy.get('h2').contains('Ärendeuppgifter').should('exist');
    cy.get('h2').contains('Bilagor').should('exist');

    //Buttons to register case, save as draft and cancel
    cy.get('[data-cy="register-errand-button"]').should('exist');
    cy.get('[data-cy="cancel-errand-button"]').should('exist');
    cy.get('[data-cy="save-draft-errand-button"]').should('exist');
  });

  it('displays all case types in the select and allows selecting a value', () => {
    const expectedLabels = Object.values(FTCaseLabel);
    const labelToSelect = FTCaseLabel.PARATRANSIT_NOTIFICATION;

    cy.get('[data-cy="errand-casetype-select"]')
      .should('exist')
      .find('option')
      .should('have.length', expectedLabels.length);

    cy.get('[data-cy="errand-casetype-select"]')
      .find('option')
      .then((options) => {
        const texts = [...options].map((o) => o.textContent?.trim());
        expect(texts).to.include.members(expectedLabels);
      });

    cy.get('[data-cy="errand-casetype-select"]').select(labelToSelect);
    cy.get('[data-cy="errand-casetype-select"]').find('option:selected').should('have.text', labelToSelect);
  });

  it('handles validation errors for personal number correctly', () => {
    //Invalid SSN
    cy.contains('Sökande').should('exist');
    cy.get('[data-cy="personal-number-input"]').first().type('Invalid input');
    cy.get('[data-cy="search-person-button"]').first().click();

    cy.contains(MOCK_INVALID_SEARCH).should('exist');

    //Valid SSN
    cy.get('[data-cy="clear-person-button"]').first().click();
    cy.get('[data-cy="personal-number-input"]').first().type(Cypress.env('mockPersonNumber'));

    cy.contains('Sök').first().click();

    cy.contains(MOCK_INVALID_SEARCH).should('not.exist');
  });

  it('adds applicant from personal number and allows editing via modal', () => {
    const email = mockProtectedInfo.emails.user;
    const emailChanged = mockProtectedInfo.emails.recipient;
    const phone = mockProtectedInfo.phoneNumbers.swedish;
    const address = mockAddressResponse.data.addresses[0];

    cy.contains('Sökande').should('exist');
    cy.get('[data-cy="personal-number-input"]').first().type(Cypress.env('mockPersonNumber'));
    cy.get('[data-cy="search-person-button"]').first().click();

    cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
    cy.contains(email).should('exist');

    // Fyll i e-postadress och telefonnummer, lägg till sökande
    cy.get('[data-cy="stakeholder-email-input"]').first().type(email);
    cy.get('[data-cy="stakeholder-mobilephone-input"]').first().type(phone);
    cy.get('[data-cy="add-stakeholder-button"]').click();

    //Kontrollera att sökande har korrekt information
    cy.contains('Ärendeägare').should('exist');
    cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
    cy.contains(address.address).should('exist');
    cy.contains(address.addressNumber).should('exist');
    cy.contains(address.city).should('exist');

    // Verifiera att redigeringsknappen finns och öppnar modalfönstret
    cy.get('[data-cy="edit-card-button"]').should('exist').click();
    cy.get('.sk-modal').should('exist');
    cy.get('[name="ssn"]').should('have.value', Cypress.env('mockPersonNumber'));
    cy.get('[name="firstName"]').should('have.value', mockAddressResponse.data.givenname);
    cy.get('[name="lastName"]').should('have.value', mockAddressResponse.data.lastname);
    cy.get('[name="newEmail"]').should('have.value', email);
    // Verifiera att telefonnumret är korrekt satt i modalen
    cy.get('[name="newPhoneNumber"]').should('have.value', phone);
    cy.get('[name="street"]').should('have.value', address.address);
    cy.get('[name="zip"]').should('have.value', address.postalCode);
    cy.get('[name="city"]').should('have.value', address.city);

    //Redigera informationen och spara sedan
    cy.get('[name="newEmail"]').clear().type(emailChanged);
    cy.get('[data-cy="modal-add-person-button"]').click();
    cy.contains(emailChanged).should('exist');
  });

  it('adds other parties', () => {
    const email = mockProtectedInfo.emails.user;
    const emailChanged = mockProtectedInfo.emails.recipient;
    const phone = mockProtectedInfo.phoneNumbers.swedish;
    const address = mockAddressResponse.data.addresses[0];

    cy.contains('Övriga parter').should('exist');

    // Klicka på "Lägg till" inom rätt sektion
    cy.get('[data-cy="otherparties-disclosure"]').within(() => {
      cy.get('[data-cy="personal-number-input"]').type(Cypress.env('mockPersonNumber'));
      cy.get('[data-cy="search-person-button"]').click();
    });

    cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
    cy.contains(email).should('exist');

    // Fyll i e-post och telefonnummer och lägg till parten
    cy.get('[data-cy="stakeholder-email-input"]').type(email);
    cy.get('[data-cy="stakeholder-mobilephone-input"]').type(phone);
    cy.get('[data-cy="add-stakeholder-button"]').click();
    cy.get('[data-cy="add-stakeholder-button"]').should('exist');

    //Unikt för övriga parter är att välja roll
    cy.get('[data-cy="stakeholder-role-select"]').select(Role.FELLOW_APPLICANT);
    cy.get('[data-cy="add-stakeholder-button"]').click();
    cy.get('[data-cy="add-stakeholder-button"]').should('not.exist');

    // Verifiera att parten har korrekt information
    cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
    cy.contains(address.address).should('exist');
    cy.contains(address.addressNumber).should('exist');
    cy.contains(address.city).should('exist');
    cy.contains(RoleDisplayNames[Role.FELLOW_APPLICANT]).should('exist');

    // Verifiera modal
    cy.get('[data-cy="edit-card-button"]').should('exist').click();
    cy.get('.sk-modal').should('exist');

    cy.get('[name="ssn"]').should('have.value', Cypress.env('mockPersonNumber'));
    cy.get('[name="ssn"]').should('have.attr', 'readonly');
    cy.get('[name="firstName"]').should('have.value', mockAddressResponse.data.givenname);
    cy.get('[name="lastName"]').should('have.value', mockAddressResponse.data.lastname);
    cy.get('[name="newEmail"]').should('have.value', email);
    cy.get('[name="newPhoneNumber"]').should('have.value', phone);
    cy.get('[name="street"]').should('have.value', address.address);
    cy.get('[name="zip"]').should('have.value', address.postalCode);
    cy.get('[name="city"]').should('have.value', address.city);
    cy.get('[name="careof"]').should('have.value', '');

    // Ändra e-post och roll sedan spara
    cy.get('[name="newEmail"]').clear().type(emailChanged);
    cy.get('[data-cy="modal-stakeholder-role-select"]').select(Role.CONTACT_PERSON);
    cy.get('[data-cy="modal-add-person-button"]').click();
    cy.contains(emailChanged).should('exist');
    cy.contains(RoleDisplayNames[Role.CONTACT_PERSON]).should('exist');

    cy.get('[data-cy="remove-card-button"]').should('exist').click();
  });

  it('can upload and remove attachments', () => {
    const fileName = 'testfile.txt';
    const fileContent = 'Detta är ett testdokument';
    const fileType = 'text/plain';

    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Blob.binaryStringToBlob(fileContent),
        fileName,
        mimeType: fileType,
        lastModified: Date.now(),
      },
      { force: true }
    );

    cy.contains(fileName).should('exist');

    cy.get('svg.lucide-trash').closest('button').click();

    cy.contains('Ta bort?').should('exist');
    cy.contains('Vill du ta bort denna bilaga?').should('exist');
    cy.contains('button', 'Ja').click();

    cy.contains(fileName).should('not.exist');
  });

  it('cancels case and handles confirmation dialog correctly', () => {
    cy.window().then((win) => {
      cy.stub(win, 'close').as('closeStub');
    });

    cy.get('[data-cy="cancel-errand-button"]').first().should('exist').click();

    cy.get('[data-cy="cancel-registration-dialog"]').should('exist').and('be.visible');

    cy.get('[data-cy="no-cancel-registration-button"]').click();

    cy.get('[data-cy="cancel-registration-dialog"]').should('not.exist');
    cy.url().should('include', '/registrera');

    cy.get('[data-cy="cancel-errand-button"]').first().click();
    cy.get('[data-cy="cancel-registration-dialog"]').should('be.visible');

    cy.get('[data-cy="yes-cancel-registration-button"]').click();
    cy.get('@closeStub').should('have.been.called');
  });

  it('save draft', () => {
    cy.intercept('POST', '**/api/casedata/2281/errands', mockErrands_FT_draft).as('saveDraft');
    cy.intercept('GET', '**/attachments', {
      statusCode: 200,
      body: {
        data: [],
        message: 'success',
      },
    }).as('getAttachments');
    cy.intercept('GET', '**/api/casedata/2281/errand/2557', mockErrands_FT_draft).as('getErrand');
    cy.intercept('GET', '**/api/casedata/2281/errand/errandNumber/**', mockErrands_FT_draft).as('getByNumber');

    cy.intercept('PATCH', '**/api/casedata/2281/errands/2557', {
      statusCode: 200,
      body: {
        message: 'success',
        data: {
          ...mockErrands_FT_draft.data,
          caseType: FTCaseType.PARATRANSIT_NOTIFICATION,
        },
      },
    }).as('patchDraft');

    cy.get('[data-cy="save-draft-errand-button"]').first().should('exist').click();

    cy.wait('@saveDraft');
    cy.wait('@getErrand');

    cy.url().should('include', `/arende/2281/${mockErrands_FT_draft.data.errandNumber}`);
    cy.contains('Ärendet sparades som utkast').should('exist');

    cy.get('[data-cy="errand-casetype-select"]').should('not.be.disabled');
    cy.get('[data-cy="errand-casetype-select"]').select(FTCaseLabel.PARATRANSIT_NOTIFICATION);
    cy.get('[data-cy="update-draft-errand-button"]').first().click();
    cy.contains(FTCaseLabel.PARATRANSIT_NOTIFICATION).should('exist');

    cy.get('[data-cy="register-errand-button"]').first().should('exist').click();

    cy.get('[data-cy="confirm-register-dialog"]').should('not.exist');
    cy.get('[data-cy="register-errand-button"]').first().click();
  });

  it('prevents registration when applicant is missing', () => {
    cy.get('[data-cy="register-errand-button"]').first().should('exist').click();
    cy.get('[data-cy="confirm-register-dialog"]').should('not.exist');
    cy.contains('Det går inte att registrera ärendet eftersom ingen sökande part är tillagd.').should('exist');
    cy.url().should('include', '/registrera');
  });

  // NOTE: Hides until PARATRANSIT_NOTIFICATION_RENEWAL is enabled again
  //
  // it('register errand (PARATRANSIT_NOTIFICATION_RENEWAL)', () => {
  //   const email = mockProtectedInfo.emails.user;
  //   const phone = mockProtectedInfo.phoneNumbers.swedish;
  //   const address = mockAddressResponse.data.addresses[0];

  //   cy.intercept('POST', '**/api/casedata/2281/errands', mockErrands_FT_registered).as('registerErrand');
  //   cy.intercept('GET', '**/attachments', {
  //     statusCode: 200,
  //     body: {
  //       data: [],
  //       message: 'success',
  //     },
  //   }).as('getAttachments');
  //   cy.intercept('GET', '**/api/casedata/2281/errand/2557', mockErrands_FT_registered).as('getErrand');
  //   cy.intercept('GET', '**/api/casedata/2281/errand/errandNumber/**', mockErrands_FT_registered).as('getByNumber');

  //   cy.get('[data-cy="errand-casetype-select"]').select(FTCaseLabel.PARATRANSIT_NOTIFICATION_RENEWAL);

  //   cy.contains('Sökande').should('exist');
  //   cy.get('[data-cy="personal-number-input"]').first().type(Cypress.env('mockPersonNumber'));
  //   cy.get('[data-cy="search-person-button"]').first().click();

  //   cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
  //   cy.contains(email).should('exist');

  //   cy.get('[data-cy="stakeholder-email-input"]').first().type(email);
  //   cy.get('[data-cy="stakeholder-mobilephone-input"]').first().type(phone);
  //   cy.get('[data-cy="add-stakeholder-button"]').click();

  //   cy.contains('Ärendeägare').should('exist');
  //   cy.contains(`${mockAddressResponse.data.givenname} ${mockAddressResponse.data.lastname}`).should('exist');
  //   cy.contains(address.address).should('exist');
  //   cy.contains(address.city).should('exist');

  //   cy.get('[data-cy="uppgift-field-external.currentHousing"]').select('OWN_HOUSING');

  //   cy.contains('Klarar den sökande att gå till och från busshållplatsen närmast bostaden?').should('exist');
  //   cy.get('[data-cy="uppgift-field-external.canReachNearestBusStop"]').within(() => {
  //     cy.get('input[value="YES"]').click();
  //   });
  //   cy.get('[data-cy="uppgift-field-external.travelTypes"]').within(() => {
  //     cy.get('input[type="checkbox"][value="PRIVATE"]').parent().click();
  //   });
  //   cy.get('[data-cy="uppgift-field-external.assistanceDuringTravel"]').within(() => {
  //     cy.get('input[value="NO"]').click();
  //   });
  //   cy.get('[data-cy="uppgift-field-medical.onsetTime"]').within(() => {
  //     cy.get('input[value="ONE_YEAR_OR_MORE"]').click();
  //   });
  //   cy.get('[data-cy="uppgift-field-medical.duration"]').within(() => {
  //     cy.get('input[value="MORE_THAN_ONE_YEAR"]').click();
  //   });
  //   cy.get('[data-cy="uppgift-field-medical.consequencesDescription"]').type('abc.');
  //   cy.get('[data-cy="uppgift-field-medical.treatmentsDescription"]').type('abc.');
  //   cy.get('[data-cy="register-errand-button"]').first().should('exist').click();

  //   cy.get('[data-cy="confirm-register-dialog"]').should('exist');
  //   cy.get('[data-cy="confirm-register-dialog"]').find('button').contains('Nej').click();
  //   cy.get('[data-cy="confirm-register-dialog"]').should('not.exist');

  //   cy.get('[data-cy="register-errand-button"]').first().click();
  //   cy.get('[data-cy="confirm-register-dialog"]').should('exist');
  //   cy.get('.sk-dialog').find('button').contains('Ja').click();

  //   cy.wait('@registerErrand');
  //   cy.wait('@getErrand');

  //   cy.url().should('include', `/arende/2281/${mockErrands_FT_registered.data.errandNumber}`);
  // });
});
