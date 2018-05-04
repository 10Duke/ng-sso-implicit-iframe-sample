import { DefaultNonceGenerator } from './default-nonce-generator.type';

describe('DefaultNonceGenerator', () =>
{
    let nonce: DefaultNonceGenerator;

    beforeEach(() =>
    {
        nonce = new DefaultNonceGenerator(Math.random);
    });

    it('should generate string of 16 characters', () =>
    {
        expect(nonce.generate().length).toBe(16);
    });

    it('should generate random characters of given set', () =>
    {
        for (let i = 0; i < 100; i++) {
            expect(nonce.generate()).toMatch(new RegExp('^[!"#%&/()=?+_<>:;.,*0-9A-Za-z-]{16}$'));
        }
    });

});
