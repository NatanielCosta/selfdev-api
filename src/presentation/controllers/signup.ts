import { InvalidParamError, MissingParamError } from '../erros'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	constructor (emailValidator: EmailValidator) {
		this.emailValidator = emailValidator
	}

	handle (httpRquest: HttpRequest): HttpResponse {
		try {
			const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
			for (const field of requiredFilds) {
				if (!httpRquest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}
			const isValid = this.emailValidator.isValid(httpRquest.body.email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}
		} catch (error) {
			return serverError()
		}
	}
}
