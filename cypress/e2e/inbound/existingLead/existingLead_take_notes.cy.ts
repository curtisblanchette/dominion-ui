describe('Inbound Call Flow - Existing Lead - Take Notes', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.login()
        cy.wait(5000)
    })

    it('set Demo Account', () => {
        // Set Demo Account
        cy.account()
        cy.wait(5000)
    })

    it('Start Inbound - Existing Lead Take Notes', () => {
        // Go to Flow Page
        cy.visit('/flow')

        // Select Inbound and proceed
        cy.calltype('Inbound')
        cy.nextstep()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('new lead 1')
        cy.wait(2000)
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
            cy.get('label').contains('Take Notes').click()
        })
        cy.nextstep()

        // Take Notes
        cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note')
        cy.nextstep()

        // Finish Call
        cy.finish()

    })

})