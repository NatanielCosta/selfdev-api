import { InvalidParamError } from '../erros/invalid-param-error'
import { MissingParamError } from '../erros/missing-param-error'
import { ServerError } from '../erros/server-error'
import { badRequest } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/emailValidator'
import { HttpRequest, HttpResponse } from '../protocols/http'

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
			return {
				statusCode: 500,
				body: new ServerError()
			}
		}
	}
}
