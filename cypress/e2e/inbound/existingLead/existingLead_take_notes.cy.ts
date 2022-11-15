describe('Inbound Call Flow - Existing Lead - Take Notes', () => {

    it('Login to Application', () => {
        cy.appLogin();
        cy.wait(5000);
    });

    it('set Demo Account', () => {
        // Set Demo Account
        cy.setAccount();
        cy.wait(5000);
    });

    it('Start Inbound - Existing Lead Take Notes', () => {
        // Go to Flow Page
        cy.visit('/flow');

        // Select Inbound and proceed
        cy.callType('Inbound');
        cy.nextStep();

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('new lead 1');
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
            cy.get('label').contains('Take Notes').click();
        });
        cy.nextStep();

        // Take Notes
        cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note');
        cy.nextStep();

        // Finish Call
        cy.finish();

    });

});
