import { SignUpController } from './signup'

describe('SignUp Controler', () => {
	it('Should return 400 if no name is provided', async () => {
		const sut = new SignUpController()
		const httRequest = {
			body: {
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
	})
})
