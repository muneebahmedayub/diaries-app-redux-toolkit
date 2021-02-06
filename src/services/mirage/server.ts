import { Server, Model, Response, hasMany, Factory, belongsTo } from 'miragejs'
import { addDiary, getDiaries, updateDiary } from './Routes/diary'
import { addEntry, getEntries, updateEntry } from './Routes/entry'
import { deleteUser, login, signup} from './Routes/user'

export const handleErrors = (message = 'An error occurred') => {
    return new Response (400, undefined, {
        data: message,
        isError: true
    })
}

export const setupServer = () => {
    new Server({
        models: {
            users: Model.extend({
                diary: hasMany()
            }),
            diaries: Model.extend({
                user: belongsTo(),
                entry: hasMany()
            }),
            entries: Model.extend({
                diary: belongsTo()
            })
        },

        factories: {
            user: Factory.extend({
                username: 'test',
                password: 'password',
                email: 'test@email.com'
            })
        },

        seeds(server) {
            server.create('user')
        },

        routes() {
            this.urlPrefix = 'https://diaries.app'

            this.get('/users', (schema: any, req: any) => schema.users.all())

            this.get('/diaries/:userId', getDiaries)
            this.patch('/diaries/:diaryId', updateDiary)
            this.post('/diaries', addDiary)

            this.get('/entries/:diaryId', getEntries)
            this.patch('/entries/:entryId', updateEntry)
            this.post('/entries/:diaryId', addEntry)

            this.post('/auth/signup', signup)
            this.post('/auth/login', login)
            this.delete('/delete-user/:userId', deleteUser)
        }
    })
}