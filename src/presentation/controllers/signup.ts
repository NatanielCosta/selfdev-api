import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
	handle (httpRquest: HttpRequest): HttpResponse {
		const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
		for (const field of requiredFilds) {
			if (!httpRquest.body[field]) {
				return badRequest(new MissingParamError(field))
			}
		}
	} 
}
