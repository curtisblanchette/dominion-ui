import { first } from "cypress/types/lodash"

describe('Inbound Call Flow - Existing Lead - Set Appt', () => {

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

    it('Start Inbound - Existing Lead Set Appt Call Flow', () => {

        // Select Inbound and proceed
        cy.get('[data-qa="call_direction"]').within(() => {
            cy.get('label').contains('Inbound').click()
        })
        cy.get('[data-qa="next"]').click()

        // Search For a Lead
        cy.get('[data-qa="search_module"]').type('Raj kumar')
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
            cy.get('label').contains('Set Appointment').click()
        })
        cy.get('[data-qa="next"]').click()

        // Power question
        cy.get('[data-qa="next"]').click()

        // Set Appointment
        cy.get('[data-qa="event-form"]').within(($form) => {
            cy.get('label[for="title"]').next().type('Test Event')

            cy.get('label[for="officeId"]').next().click()
            cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
                cy.wrap($buttons).each(($el, $index, $list) => {
                    if( $el.find('button').text().trim() == 'Charleston' ){
                        cy.wrap($el).click()
                    }
                })
            })

            cy.get('label[for="typeId"]').next().click()
            cy.get('[data-qa="dropdown-items"]').within(($buttons) => {
                cy.wrap($buttons).each(($el, $index, $list) => {
                    if( $el.find('button').text().trim() == 'Sales Consultation' ){
                        cy.wrap($el).click()
                    }
                })
            })
            cy.get('label[for="description"]').next().type('Test Description for event')
        })

        cy.get('[data-qa="regular-slots"]').find('[data-qa="slot-time"]').first().click()
        cy.get('[data-qa="next"]').click()

        // Recap
        cy.get('[data-qa="next"]').click()

        // Finish Call
        cy.get('[data-qa="finish-call"]').click()

    })

})