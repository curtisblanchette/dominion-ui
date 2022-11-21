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
    cy.isNextDisabled();
    cy.get('[data-qa="call_direction"]').within(() => {
      cy.get('label').contains('Inbound').click();
    });    
    cy.nextStep();

    // Create new lead
    cy.isNextDisabled();
    cy.get('[data-qa="new-module"]').should('be.visible').click();

    // Enter lead info and proceed
    cy.isNextDisabled();
    cy.get('[data-qa="new-module-form"]').should('be.visible').within(($form) => {
      cy.get('label[for="firstName"]').next().type(this['fname']);
      cy.get('label[for="lastName"]').next().type(this['lname']);
      cy.get('label[for="phone"]').next().type(this['phone']);
      cy.get('label[for="email"]').next().type(this['email']);
    });
    cy.nextStep();

    // Select Campaign
    cy.isNextDisabled();
    cy.get('label[for="campaignId"]').next().click();
    cy.get('[data-qa="dropdown-items"]').first().click();
    cy.nextStep();

    // relationship building
    cy.isNextDisabled();
    cy.get('[data-qa="new-module-form"]').within(($form) => {
      cy.get('label[for="practiceAreaId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').first().click();
    });
    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appt
    cy.isNextDisabled();
    cy.get('[data-qa="event-form"]').should('be.visible').within(($form) => {
      cy.get('label[for="title"]').next().type('Test Event');

      cy.get('label[for="officeId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Charleston') {
            cy.wrap($el).click();
          }
        });
      });

      cy.get('label[for="typeId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
        cy.wrap($buttons).each(($el, $index, $list) => {
          if ($el.find('button').text().trim() == 'Sales Consultation') {
            cy.wrap($el).click();
          }
        });
      });
      cy.get('label[for="description"]').next().type('Test Description for event', {force: true});
    });

    cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();
  });

});
