describe('Inbound Call Flow - Existing Lead - Take Notes', () => {
  it('Start Inbound - Existing Lead Take Notes', () => {
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
      cy.searchLeads(name);
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
        cy.get('label').contains('Take Notes').click();
      });
      cy.nextStep();

      // Take Notes
      cy.get('[data-template="take-notes"]').should('exist').find('iframe').its('0.contentDocument.body').then(cy.wrap).type('this is a test');
      cy.nextStep();

      // Finish Call
      cy.finish();
    
    });
  });
});
