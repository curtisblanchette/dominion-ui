describe('Inbound Call Flow - Existing Lead - Set Appt', () => {
  it('Start Inbound - Existing Lead Set Appt Call Flow', () => {

    // Go to Flow Page
    cy.visit('/flow');

    cy.request({
      url : `${Cypress.env('API_URL')}/leads`,
      method : 'get'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('count').to.be.greaterThan(0)
      expect(response.body).to.have.property('rows').length.greaterThan(0)

      const name:string = response.body.rows[0].fullName;

      // Select Inbound and proceed
      cy.callType('Inbound');
      cy.nextStep();

      // Search For a Lead
      cy.get('[data-qa="search_module"]').should('be.visible').type(name);
      cy.intercept({
        method: "GET",
        url: "**/api/v1/leads/?**",
      }).as("searchLeads")
      cy.wait("@searchLeads")
      cy.get('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).first().click();
      cy.nextStep();

      // Review Lead Info
      cy.nextStep();

      // Select Deal
      cy.get('[data-qa="table-row"]').should('be.visible').should('have.length.at.least',1).first().click();
      cy.nextStep();

      // Review Opportunity
      cy.nextStep();

      // Reason For Call
      cy.get('[data-template="reason-for-call"]').should('be.visible').within(($form) => {
        cy.get('label').contains('Set Appointment').click();
      });
      cy.nextStep();

      // Power question
      cy.nextStep();

      // Set Appointment
      cy.createEvent();
      cy.nextStep();

      // Recap
      cy.nextStep();

      // Finish Call
      cy.finish();

    });

  });

});
