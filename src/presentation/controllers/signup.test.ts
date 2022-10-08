import { MissingParamError } from '../erros/missing-param-error'
import { HttpRequest } from '../protocols/http'
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
		const httpResponse = sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('name'))
	})

	it('Should return 400 if no email is provided', async () => {
		const sut = new SignUpController()
		const httRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = await sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('email'))
	})

	it('Should return 400 if no password is provided', async () => {
		const sut = new SignUpController()
		const httRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('password'))
	})

	it('Should return 400 if no password confirmation is provided', async () => {
		const sut = new SignUpController()
		const httRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password'
			}
		}
		const httpResponse = sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
	})
})
