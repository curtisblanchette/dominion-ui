describe('Inbound Call Flow - Existing Lead - Resc Appt', () => {

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

    it('Start Inbound - Existing Lead Reschedule Appointment Call Flow', () => {
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
            cy.get('label').contains('Reschedule Appointment').click()
        })
        cy.nextstep()

        // Select Appointment
        cy.get('.flex-table__row').first().click()
        cy.nextstep()

        // Set Appointment
        cy.get('#title').type('New Event - Resc')

        cy.get('section.flow-layout__content fiiz-dropdown').eq(0).click()
        cy.get('section.flow-layout__content .dropdown-menu__items').first().click()

        cy.get('section.flow-layout__content fiiz-dropdown').eq(1).click()
        cy.get('section.flow-layout__content .dropdown-menu__items').eq(0).click()

        cy.get('fiiz-textarea textarea').type('Test Description for event')

        cy.get('div.slots__times').first().click()

        cy.nextstep()

        // Recap
        cy.nextstep()

        // Finish Call
        cy.finish()

    })

})