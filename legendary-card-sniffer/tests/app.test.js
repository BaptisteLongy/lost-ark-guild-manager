const request = require('supertest')
const app = require('../src/app')

describe('GET Arcturus info', () => {
    it('should send an array response', async () => {
        const response = await request(app).get('/Arcturus')
        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBe(true);
    },
        100000)
})

describe('GET unknown server info', () => {
    it('should send a 404 for aaaaaaa', async () => {
        const response = await request(app).get('/aaaaaaa')
        expect(response.statusCode).toBe(404)
    })

    it('should send a 404 for case error', async () => {
        const response = await request(app).get('/arcturus')
        expect(response.statusCode).toBe(404)
    })
})