import * as OTPAuth from 'otpauth';

describe('Forms Page', () => {

    before(() => {
      cy.login('RegisterPage', 'Register page');
    });

    it('set up 2fa', () => {
        cy.contains('Setup 2fa').click();
        cy.wait(1500);
        cy.get('code')
            .then((code) => {
                var secret = code.text();
                console.log(secret);
                var token1 = new OTPAuth.TOTP({
                    digits: 6,
                   secret: OTPAuth.Secret.fromB32(secret)
                }).generate();
                console.log(token1);
                cy.get('input[type=text]').type(token1);
                cy.contains('Submit').click();
                cy.wait(1000);

                
            
                var token2 = new OTPAuth.TOTP({
                    digits: 6,
                   secret: OTPAuth.Secret.fromB32(secret)
                }).generate();
                console.log(token2);
                cy.get('input[type=text]').type(token2);
                cy.contains('Submit').click();
                cy.wait(1000);
            });

            });

      });
    