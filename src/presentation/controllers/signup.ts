import { MissingParamError } from '../erros/missing-param-error'
import { badRequest } from '../helpers/http-helper'
import { HttpRequest, HttpResponse } from '../protocols/http'

export class SignUpController {
	handle (httpRquest: HttpRequest): HttpResponse {
		if (!httpRquest.body.name) {
			return badRequest( new MissingParamError('name'))
		}
		if (!httpRquest.body.email) {
			return badRequest( new MissingParamError('email'))
		}
	} 
}
