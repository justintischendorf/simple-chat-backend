import { Elysia } from 'elysia'

new Elysia()
    .get('/ping', 'pong')
    .listen(3000)