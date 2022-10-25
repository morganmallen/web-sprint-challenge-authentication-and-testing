// Write your tests here
const request = require('supertest')
const server = require('../api/server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /api/auth/login', () => {
  
  it('respons with the correct status and message on incorrect username', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'morgie', password: '1234' })
          expect(res.body.message).toMatch(/invalid credentials/i)
          expect(res.status).toBe(401)})
        
  
  it('responds with the correct status and message on invalid password', async () => {
    let res = await request(server).post('/api/auth/login').send({ username: 'morgan', password: '12345' })
    expect(res.body.message).toMatch(/invalid credentials/i)
    expect(res.status).toBe(401)
  })
})

describe('[POST] /api/auth/register', () => {
  const user = { name: 'user', password: 'pw' }
  test('adds a user to the database', async () => {
      await request(server).post('/api/auth/register').send(user)
      expect(await db('users')).toHaveLength(0)
  })
  test('responds with an error if missing a username or password', async () => {
      const res = await request(server).post('/api/auth/register').send({username: 'bob'})
      expect(res.status).toEqual(404)
  })
})

describe('[GET] /api/jokes', () => {
  test('responds with an error if not authorized', async () => {
    const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
  test('requests with an invalid token are bounced with proper status and message', async () => {
    const res = await request(server).get('/api/jokes').set('Authorization', 'foobar')
    expect(res.body.message).toMatch(/token invalid/i)
  }, 750)  
})
