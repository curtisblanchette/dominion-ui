describe('Inbound Call Flow - Existing Lead - Cancel Appt', () => {

    it('Start Inbound - Existing Lead Cancel Appt Call Flow', () => {

        // Go to Flow Page
        cy.visit('/flow');

        // Select Inbound and proceed
        cy.isNextDisabled();
        cy.callType('Inbound');
        cy.nextStep();

        // Search For a Lead
        cy.isNextDisabled();
        cy.get('[data-qa="search_module"]').should('be.visible').type('Raj kumar')
        cy.intercept({
            method: "GET",
            url: "**/api/v1/leads/?**",
        }).as("searchLeads")
        cy.wait("@searchLeads")
        cy.get('[data-qa="table-row"]').should('be.visible').should('not.be.empty').first().click();
        cy.nextStep();

        // Review Lead Info
        cy.nextStep();

        // Select Deal
        cy.isNextDisabled();
        cy.get('[data-qa="table-row"]').should('be.visible').should('be.at.least',1).first().click();
        cy.nextStep();

        // Review Opportunity
        cy.nextStep();

        // Reason For Call
        cy.isNextDisabled();
        cy.get('[data-qa="reason-for-call"]').should('be.visible').within(($form) => {
            cy.get('label').contains('Cancel Appointment').click();
        });
        cy.nextStep();

        // Select Appointment to cancel
        cy.get('[data-qa="table-row"]').should('be.visible').should('be.at.least',1).first().click();
        cy.nextStep();

        // Cancel Appointment
        cy.nextStep();

        // Finish Call
        cy.finish();

    });

});
