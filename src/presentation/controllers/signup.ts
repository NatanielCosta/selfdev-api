import { AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../erros'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
	private readonly emailValidator: EmailValidator
	private readonly addAccount: AddAccount
	constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
		this.emailValidator = emailValidator
		this.addAccount = addAccount
	}

	handle (httpRquest: HttpRequest): HttpResponse {
		try {
			const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
			for (const field of requiredFilds) {
				if (!httpRquest.body[field]) {
					return badRequest(new MissingParamError(field))
				}
			}
			const { name, email, password, passwordConfirmation } = httpRquest.body
			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'))
			}
			const isValid = this.emailValidator.isValid(email)
			if (!isValid) {
				return badRequest(new InvalidParamError('email'))
			}
			this.addAccount.add({
				name,
				email,
				password
			})
		} catch (error) {
			return serverError()
		}
	}
}
