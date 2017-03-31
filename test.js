const expect = require('chai').expect
const sinon = require('sinon')
const request = require('request-promise-native')

const VERIFY = require('./index')

let meh = null
describe('test', () => {
    beforeEach(() => {
        meh = sinon.stub(request, 'post')
    })

    afterEach(() => meh.restore())

    it('should make a request that succeeds', done => {
        request.post.resolves('{"success":true}');

        (new VERIFY('mySecret')).validate('fooToken')
            .then(result => {
                expect(result).to.be.true
                expect(request.post.args[0][0]).to.deep.equal({uri: 'https://www.google.com/recaptcha/api/siteverify', form: {secret: 'mySecret', response: 'fooToken'}})
                
                done()
            })
            .catch(e => expect(true).to.be.false)
    })

    it('should make a request that succeeds with Proxy (hostonly)', done => {
        request.post.resolves('{"success":true}');

        (new VERIFY('mySecret', {host: 'proxyHost'})).validate('fooToken')
            .then(result => {
                expect(result).to.be.true
                expect(request.post.args[0][0]).to.deep.equal({
                    uri: 'https://www.google.com/recaptcha/api/siteverify',
                    form: {secret: 'mySecret', response: 'fooToken'},
                    proxy: 'http://proxyHost'
                })

                done()
            })
            .catch(e => expect(true).to.be.false)
    })

    it('should make a request that succeeds with Proxy (with auth)', done => {
        request.post.resolves('{"success":true}');

        (new VERIFY('mySecret', {host: 'proxyHost', username: 'fooUser', password: 'fooPassword'})).validate('fooToken')
            .then(result => {
                expect(result).to.be.true
                expect(request.post.args[0][0]).to.deep.equal({
                    uri: 'https://www.google.com/recaptcha/api/siteverify',
                    form: {secret: 'mySecret', response: 'fooToken'},
                    proxy: 'http://fooUser:fooPassword@proxyHost'
                })

                done()
            })
            .catch(e => expect(true).to.be.false)
    })

    it('should make a request that succeeds with Proxy (with auth + port)', done => {
        request.post.resolves('{"success":true}');

        (new VERIFY('mySecret', {host: 'proxyHost', username: 'fooUser', password: 'fooPassword', port: 1337})).validate('fooToken')
            .then(result => {
                expect(result).to.be.true
                expect(request.post.args[0][0]).to.deep.equal({
                    uri: 'https://www.google.com/recaptcha/api/siteverify',
                    form: {secret: 'mySecret', response: 'fooToken'},
                    proxy: 'http://fooUser:fooPassword@proxyHost:1337'
                })

                done()
            })
            .catch(e => expect(true).to.be.false)
    })

    it('should make a request that succeeds with Proxy (with auth + port + https)', done => {
        request.post.resolves('{"success":true}');

        (new VERIFY('mySecret', {host: 'proxyHost', username: 'fooUser', password: 'fooPassword', port: 1337, protocol: 'https'})).validate('fooToken')
            .then(result => {
                expect(result).to.be.true
                expect(request.post.args[0][0]).to.deep.equal({
                    uri: 'https://www.google.com/recaptcha/api/siteverify',
                    form: {secret: 'mySecret', response: 'fooToken'},
                    proxy: 'https://fooUser:fooPassword@proxyHost:1337'
                })

                done()
            })
            .catch(e => expect(true).to.be.false)
    })

    it('should make a request that fails', done => {
        request.post.resolves('{"success":false, "error-codes": ["foo", "bar"]}');

        (new VERIFY('mySecret', {host: 'proxyHost', username: 'fooUser', password: 'fooPassword', port: 1337, protocol: 'https'})).validate('fooToken')
            .then(result => expect(true).to.be.false)
            .catch(error => {
                expect(error.message).to.equal('failed to verify: foo,bar')
                expect(error.errorCodes).to.deep.equal(['foo', 'bar'])

                done()
            })
    })
})