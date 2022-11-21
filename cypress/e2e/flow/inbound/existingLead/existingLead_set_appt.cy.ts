describe('Inbound Call Flow - Existing Lead - Set Appt', () => {
  it('Start Inbound - Existing Lead Set Appt Call Flow', () => {

    // Go to Flow Page
    cy.visit('/flow');

    // Select Inbound and proceed
    cy.callType('Inbound');
    cy.nextStep();

    // Search For a Lead
    cy.get('[data-qa="search_module"]').type('Raj kumar');
    cy.wait(2000);
    cy.get('[data-qa="table-row"]').first().click();
    cy.nextStep();

    // Review Lead Info
    cy.nextStep();

    // Select Deal
    cy.get('[data-qa="table-row"]').first().click();
    cy.nextStep();

    // Review Opportunity
    cy.nextStep();

    // Reason For Call
    cy.get('[data-qa="reason-for-call"]').within(($form) => {
      cy.get('label').contains('Set Appointment').click();
    });
    cy.nextStep();

    // Power question
    cy.nextStep();

    // Set Appointment
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
