describe('Flow', () => {

  it('Logs into the app', () => {
    cy.appLogin();
  });

  it('Selects the Demo account', () => {
    cy.setAccount();
  });

  it('Loads the flow module', () => {
    cy.visit('/flow');
    cy.get('.flow-layout').then($layout => {
      $layout.is(':visible');
    });
  });

  it('Renders the first step', () => {
    cy.get('flow-text[data-template="call-direction"]').then($cmp => {
      $cmp.is(':visible');
      // continue initially disabled
    });
  });

  it('Selects a call direction', () => {

  });
})
