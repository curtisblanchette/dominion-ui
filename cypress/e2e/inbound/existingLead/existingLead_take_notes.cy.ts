describe('Inbound Call Flow - Existing Lead - Take Notes', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.get('[data-qa="login-form"]').within(($form) => {
            cy.get('[data-qa="username"]').type('4iiz.system@4iiz.com')
            cy.get('[data-qa="password"]').type('$BeBetter911')
            cy.wrap($form).submit();
        })
        cy.wait(5000)
    })

    it('set Demo Account', () => {
        // Set Demo Account
        cy.get('[data-qa="accounts-form"]').within(($form) => {
            cy.get('fiiz-dropdown').click()
        })
        cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
            cy.wrap($buttons).each(($el, $index, $list) => {
                if( $el.find('button').text().trim() == 'demo' ){
                    cy.wrap($el).click()
                }
            })
        })
        cy.wait(5000)
        // Go to Flow Page
        cy.visit('/flow')
    })

    it('Start Inbound - Existing Lead Take Notes', () => {
        // Select Inbound and proceed
        cy.get('[data-qa="call_direction"]').within(() => {
            cy.get('label').contains('Inbound').click()
        })
        cy.get('[data-qa="next"]').click()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('new lead 1')
        cy.wait(2000)
        cy.get('[data-qa="table-row"]').first().click()
        cy.get('[data-qa="next"]').click()

        // Review Lead Info
        cy.get('[data-qa="next"]').click()

        // Select Deal
        cy.get('[data-qa="table-row"]').first().click()
        cy.get('[data-qa="next"]').click()

        // Review Opportunity
        cy.get('[data-qa="next"]').click()

        // Reason For Call
        cy.get('[data-qa="reason-for-call"]').within(($form) => {
            cy.get('label').contains('Take Notes').click()
        })
        cy.get('[data-qa="next"]').click()

        // Take Notes
        cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).type('This is a test note')
        cy.get('[data-qa="next"]').click()

        // Finish Call
        cy.get('#finish_call').click()

    })

})