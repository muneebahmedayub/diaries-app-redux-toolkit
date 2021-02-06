import { Request, Response } from "miragejs";
import { handleErrors } from "../server";
import { User } from '../../../interfaces/user.interface'
import { randomBytes } from "crypto";

const generateToken = () => randomBytes(8).toString('hex')

export interface AuthResponse {
    token: string
    user: User
}

export const login = (schema: any, req: Request): AuthResponse | Response => {
    const { username, password } = JSON.parse(req.requestBody)
    const user = schema.users.findBy({ username })

    if (!user) return handleErrors('No user with that name exist')

    if (password !== user.password) return handleErrors('Password is incorrect')

    const token = generateToken()

    return {
        user: user.attrs as User,
        token
    }
}

export const signup = (schema: any, req: Request): AuthResponse | Response => {
    const data = JSON.parse(req.requestBody)
    const exUser = schema.users.findBy({ username: data.username })
    const exEmail = schema.users.findBy({ email: data.email })

    if(exUser) return handleErrors('User with this username already exists')

    if(exEmail) return handleErrors('User with this email already exists')

    const user = schema.users.create(data)

    const token = generateToken()

    return {
        user: user.attrs as User,
        token
    }
}

export const deleteUser = (schema: any, req: Request): any => {
    const { userId } = req.params
    const user = schema.users.find(userId)
    user.destroy()
    
}