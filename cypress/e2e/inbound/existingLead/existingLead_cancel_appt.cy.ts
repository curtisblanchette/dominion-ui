describe('Inbound Call Flow - Existing Lead - Cancel Appt', () => {
    
    it('Start Inbound - Existing Lead Cancel Appt Call Flow', () => {

        // Go to Flow Page
        cy.visit('/flow')

        // Select Inbound and proceed
        cy.calltype('Inbound')
        cy.nextstep()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('Raj kumar')
        cy.intercept({
            method: "GET",
            url: "**/api/v1/leads/?**",
        }).as("searchLeads")
        cy.wait("@searchLeads")
        cy.get('[data-qa="table-row"]').first().click()
        cy.nextstep()

        // Review Lead Info
        cy.nextstep()

        // Select Deal
        cy.get('[data-qa="table-row"]').first().click()
        cy.nextstep()

        // Review Opportunity
        cy.nextstep()

        // Reason For Call
        cy.get('[data-qa="reason-for-call"]').within(($form) => {
            cy.get('label').contains('Cancel Appointment').click()
        })
        cy.nextstep()

        // Select Appointment to cancel
        cy.get('[data-qa="table-row"]').first().click()
        cy.nextstep()

        // Cancel Appointment
        cy.get('#next').click()

        // Finish Call
        cy.finish()

    })

})