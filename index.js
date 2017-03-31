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
            method: 'POST',
            uri: URL,
            form: {
                secret: this._secretkey,
                response: token
            }
        }

        if (this.proxy) {
            let auth = this._proxy.username ? `${this._proxy.username}:${this._proxy.password}@` : ''
            let port = this._proxy.port ? `:${this._proxy.port}` : ''
            let protocol = this._proxy.protocol || 'http://'

            requestObject.proxy = `${protocol}${auth}${this._proxy.host}${port}`
        }

        return request(requestObject).then(response => {
            let parsed = JSON.parse(response)

            //const errorCodes = body['error-codes']
            //
            //const errorCodesList = Array.isArray(errorCodes)
            //    ? errorCodes.join(', ')
            //    : 'Unknown'
            //
            //return callback && callback(
            //        new Error(`Failed to verify: ${errorCodesList}`)
            //        , body
            //    )

            return parsed.success || Promise.reject(new Error('unknown error with recaptcha'))
        })
    }
}

module.exports = Recaptcha