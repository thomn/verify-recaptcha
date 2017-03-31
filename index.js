'use strict'

const request = require('request-promise-native')

const URL = 'https://www.google.com/recaptcha/api/siteverify'

class Recaptcha {
    constructor(secretKey, proxy) {
        this._secretkey = secretKey
        this._proxy = proxy || null
    }

    validate(token) {
        let requestObject = {
            uri: URL,
            form: {
                secret: this._secretkey,
                response: token
            }
        }

        if (this._proxy) {
            let auth = this._proxy.username ? `${this._proxy.username}:${this._proxy.password}@` : ''
            let port = this._proxy.port ? `:${this._proxy.port}` : ''
            let protocol = (this._proxy.protocol || 'http') + '://'

            requestObject.proxy = `${protocol}${auth}${this._proxy.host}${port}`
        }

        return request.post(requestObject).then(response => {
            let parsed = JSON.parse(response)

            if (!parsed.success) {
                let errorCodes = parsed['error-codes']
                let error = new Error('failed to verify: ' + errorCodes.join(','))
                error.errorCodes = errorCodes

                return Promise.reject(error)
            }

            return true
        })
    }
}

module.exports = Recaptcha