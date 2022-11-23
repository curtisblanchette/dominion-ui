import { faker } from '@faker-js/faker';

describe('Inbound Call Flow - New Lead', function()  {

  beforeEach(() => {
    // Declare variables to be used
    const fname:string = faker.name.firstName('male');
    const lname:string = faker.name.lastName('male');
    const emails:string = faker.internet.email(fname, lname);
    const phone:string = faker.phone.phoneNumber('2244######');

    cy.wrap(fname).as('fname');
    cy.wrap(lname).as('lname');
    cy.wrap(emails).as('email');
    cy.wrap(phone).as('phone');

  })

  it('Start Inbound - Create New Lead', function() {

    cy.visit('/flow');

    // Select Inbound and proceed
    cy.get('[data-template="call-direction"]').within(($step) => {
      cy.contains('Inbound').click();
    });

    cy.nextStep();

    cy.get('[data-qa="lead-list"]').within(($step) => {
      cy.get('[data-qa="new-module-button"]').click();
    });

    // nextStep is performed automatically

    cy.get('[data-qa="create-lead"]').within(($step) => {
      // Enter lead info and proceed
      cy.get('label[for="firstName"]').next().type('Raj kumar');
      cy.get('label[for="lastName"]').next().type('Patel');
      cy.get('label[for="phone"]').next().type('4423898290');
      cy.get('label[for="email"]').next().type('raj@test.com');
    });

    cy.nextStep();

    cy.get('[data-qa="edit-lead"]').within(($step) => {
      // Select Campaign
      cy.get('label[for="campaignId"]').next().click();
      cy.get('[data-qa="dropdown-item"]').first().click();
    });

    cy.nextStep();

    // relationship building
    cy.get('[data-template="relationship-building"]').within(($step) => {
      cy.get('[data-qa="edit-lead"]').first().within(() => {
        cy.get('[data-qa="practiceArea-dropdown"]').click();
        cy.get('[data-qa="dropdown-item"]').first().click();
      });
    });

    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appt
    cy.get('flow-appointment').within(($form) => {
      cy.get('label[for="title"]').next().type('Test Event');

      cy.get('label[for="officeId"]').next().click();
      cy.get('[data-qa="dropdown-item"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Charleston') {
            cy.wrap($el).click();
          }
        });
      });

      cy.get('label[for="typeId"]').next().click();
      cy.get('[data-qa="dropdown-item"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Sales Consultation') {
            cy.wrap($el).click();
          }
        });
      });
      cy.get('label[for="description"]').next().type('Test Description for event', {force: true});

      cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
    });


    cy.wait(100);

    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();
  });

});
