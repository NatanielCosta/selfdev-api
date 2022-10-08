import { InvalidParamError } from '../erros/invalid-param-error'
import { MissingParamError } from '../erros/missing-param-error'
import { HttpRequest } from '../protocols/http'
import { SignUpController } from './signup'
import { EmailValidator } from '../protocols/emailValidator'
import { ServerError } from '../erros/server-error'

interface SutTypes {
	sut: SignUpController
	emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true
		}
	}

	const emailValidatorStub = new EmailValidatorStub()
	const sut = new SignUpController(emailValidatorStub)

	return {
		sut,
		emailValidatorStub
	}
}

describe('SignUp Controler', () => {
	it('Should return 400 if no name is provided', async () => {
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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
		const { sut } = makeSut()
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

	it('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut()
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
		const httRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new InvalidParamError('email'))
	})

	it('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut()
		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
		const httRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		sut.handle(httRequest)
		expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
	})

	it('Should return 500 if EmailValidator throws', async () => {
		class EmailValidatorStub implements EmailValidator {
			isValid (email: string): boolean {
				throw new Error()
			}
		}
		const emailValidatorStub = new EmailValidatorStub()
		const sut = new SignUpController(emailValidatorStub)
		const httRequest: HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_email@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}
		const httpResponse = sut.handle(httRequest)
		expect(httpResponse.statusCode).toBe(500)
		expect(httpResponse.body).toEqual(new ServerError())
	})
})
