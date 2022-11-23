describe('Inbound Call Flow - Existing Lead - Resc Appt', () => {
  it('Start Inbound - Existing Lead Reschedule Appointment Call Flow', () => {
    // Go to Flow Page
    cy.visit('/flow');

    cy.getLocalStorage('state').then((res:any) => {
      const parsed:{[key:string] : any} = JSON.parse(res);
      const setAppId = parsed["app"].lookups.leadStatus.find((stage:any) => stage.label == 'Set Appointment')?.id;
      
      cy.request({
          url : `${Cypress.env('API_URL')}/leads?statusId=${setAppId}`,
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
        cy.get('[data-qa="search_module"]').should('be.visible').type(name)
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
          cy.get('label').contains('Reschedule Appointment').click();
        });
        cy.nextStep();

        // Select Appointment
        cy.get('.flex-table__row').should('be.visible').should('have.length.at.least',1).first().click();
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

});
