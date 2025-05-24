Cypress.config('defaultCommandTimeout', 12000); // Aumenta el tiempo de espera por comando

describe('Prueba de Login con backend real', () => {
  it('Debería iniciar sesión con credenciales válidas y redirigir según el rol', () => {
    cy.visit('http://localhost:5173/login');

    cy.wait(1000); // Pausa de 1 segundo para dar tiempo a que cargue la página
    cy.get('input[placeholder*="identificación"]').type('111111111');
    
    cy.wait(1000); // Pausa de 1 segundo antes de escribir la contraseña
    cy.get('input[placeholder*="contraseña"]').type('C@ntraseña123');

    // Simula CAPTCHA en modo test
    cy.window().then((win) => {
      win.Cypress = true;
    });

    cy.wait(1000); // Pausa de 1 segundo antes de hacer clic
    cy.contains('Ingresar').click();

    // Espera el modal y lo cierra
    cy.contains('Inicio de sesión exitoso').should('be.visible', {timeout: 15000}); // Aumenta el tiempo de espera para el modal
    cy.wait(1000); // Pausa antes de hacer clic en "Aceptar"
    cy.contains('Aceptar').click();

    // Verifica redirección según el rol
    cy.wait(2000); // Pausa de 2 segundos antes de verificar la URL
    cy.url().should('match', /\/($|home(Doctor|Admin))/);
  });
});
