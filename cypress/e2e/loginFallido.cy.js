Cypress.config('defaultCommandTimeout', 12000); // Aumenta el tiempo de espera por comando

describe('Prueba de Login con backend real (Usuario no existente)', () => {
  it('Debería mostrar un mensaje de error cuando el usuario no exista', () => {
    cy.visit('http://localhost:5173/login');

    cy.wait(1000); // Pausa de 1 segundo para dar tiempo a que cargue la página
    cy.get('input[placeholder*="identificación"]').type('0000000000'); // Usuario inexistente
    
    cy.wait(1000); // Pausa de 1 segundo antes de escribir la contraseña
    cy.get('input[placeholder*="contraseña"]').type('C@ntraseña123'); // Contraseña de prueba

    // Simula CAPTCHA en modo test
    cy.window().then((win) => {
      win.Cypress = true;
    });

    cy.wait(1000); // Pausa de 1 segundo antes de hacer clic
    cy.contains('Ingresar').click();

    // Verifica que se muestra el mensaje de error
    cy.contains('Error al iniciar sesión. Verifique sus credenciales.').should('be.visible');
    cy.wait(1000); // Pausa antes de terminar el test

    // Verifica que la URL no cambie (permanezca en la página de login)
    cy.url().should('eq', 'http://localhost:5173/login');
  });
});
