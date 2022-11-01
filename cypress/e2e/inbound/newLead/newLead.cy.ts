describe('Inbound Call Flow - New Lead', () => {

    it('Login to Application', () => {
        cy.visit('/')
        cy.get('#username').type('4iiz.system@4iiz.com')
        cy.get('#password').type('$BeBetter911')
        cy.get('#login-form').submit().then( (res) => {
            console.log('Login Completed');
        });
        cy.wait(2000)
    })

    it('set Demo Account and start call flow', () => {
        // Set Demo Account
        cy.wait(2000)
        cy.get('#actingFor').click()
        cy.get('.dropdown-menu__items').eq(0).click()
        cy.get('#accounts-form').submit()
        cy.wait(5000)

        // Go to Flow Page
        cy.visit('/flow')

        // Select Inbound and proceed
        cy.get('label[for="call_direction_inbound"]').click()
        cy.get('#next').click()

        // Create new lead
        cy.get('form.list-actions button').click()

        // Enter lead info and proceed
        cy.get('#firstName').type('Raj kumar')
        cy.get('#lastName').type('Patel')
        cy.get('#phone').type('4428982781')
        cy.get('#email').type('raj@test.com')
        cy.get('#next').click()

        // Select Campaign
        cy.get('form fiiz-dropdown').first().click()
        cy.get('.dropdown-menu__items').first().click()
        cy.get('#next').click()

        // relationship building
        cy.get('.relationship-building fiiz-data').first().click()
        cy.get('.dropdown-menu__items').first().click()

        cy.get('.relationship-building fiiz-data').eq(1).click()
        cy.get('.dropdown-menu__items').first().click()
        cy.get('#next').click()

        // Power question
        cy.get('#next').click()

        // Set Appt
        cy.get('#title').type('Test Event')

        cy.get('section.flow-layout__content fiiz-dropdown').eq(0).click()
        cy.get('section.flow-layout__content .dropdown-menu__items').first().click()

        cy.get('section.flow-layout__content fiiz-dropdown').eq(1).click()
        cy.get('section.flow-layout__content .dropdown-menu__items').eq(0).click()

        cy.get('fiiz-textarea textarea').type('Test Description for event')

        cy.get('div.slots__times').first().click()

        cy.get('#next').click()

        // Recap
        cy.wait(2000)
        cy.get('#next').click()

        // Finish Call
        cy.get('#finish_call').click()


    })

})
  