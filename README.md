# verify-recaptcha

`verify-recaptcha` is a little library that handles the connection to the google verification backend.
Features a optional proxy configuration and a promise backend.

## Installation

````bash
npm i verify-recaptcha
````

## Usage

````javascript
const VerifyRecaptcha = require('verify-recaptcha')

let myVerification = new VerifyRecaptcha('8673cd022af7f5af00a07db3a95ffe74b245b0e8cc7d03657')

myVerification.validate('1234545')
    .then(result => console.log('token verified!')
    .catch(error => {
        console.log('verification failed: ' + error.errorCodes.join(',')
    })
````

### With Proxy

The constructor also accepts a proxy configuration in the following form:

````javascript
{
    "host": "host",
    "port": 1337,                 //optional, defaults to 80
    "username": "myUsername",     //optional
    "password": "myPassword",     //optional, required of username has been set
    "protocol": "https"           //optional, defaults to 'http'
}
````

````javascript
const VerifyRecaptcha = require('verify-recaptcha')

let mySecret = '8673cad02e2af7ff5afc00a0b7d2b3a4951ffea74bc245bb0ee8cc7dd03f657'
let myProxyConfig = {host: 'proxyHost'}
let myVerification = new VerifyRecaptcha(mySecret, myProxyConfig)

myVerification.validate('1234545')
    .then(result => console.log('token verified!')
    .catch(error => {
        console.log('verification failed: ' + error.errorCodes.join(',')
    })
````