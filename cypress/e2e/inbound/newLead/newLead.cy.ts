describe('Inbound Call Flow - New Lead', () => {


  it('Start Inbound - Create New Lead', () => {

    cy.visit('/flow');

    // Select Inbound and proceed
    cy.get('[data-qa="call_direction"]').within(() => {
      cy.get('label').contains('Inbound').click();
    });
    cy.nextStep();

    // Create new lead
    cy.get('[data-qa="new-module"]').click();

    // Enter lead info and proceed
    cy.get('[data-qa="new-module-form"]').within(($form) => {
      cy.get('label[for="firstName"]').next().type('Raj kumar');
      cy.get('label[for="lastName"]').next().type('Patel');
      cy.get('label[for="phone"]').next().type('4423898290');
      cy.get('label[for="email"]').next().type('raj@test.com');
    });
    cy.nextStep();

    // Select Campaign
    cy.get('label[for="campaignId"]').next().click();
    cy.get('[data-qa="dropdown-items"]').first().click();
    cy.nextStep();

    // relationship building
    cy.get('[data-qa="new-module-form"]').within(($form) => {
      cy.get('label[for="practiceAreaId"]').next().click();
      cy.get('[data-qa="dropdown-items"]').first().click();
    });
    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appt
    cy.get('[data-qa="event-form"]').within(($form) => {
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
      cy.get('label[for="description"]').next().type('Test Description for event');
    });

    cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click();
    cy.nextStep();

    // Recap
    cy.nextStep();

    // Finish Call
    cy.finish();


  });

});
