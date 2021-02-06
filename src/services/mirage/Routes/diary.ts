import dayjs from "dayjs";
import { Request, Response } from "miragejs";
import { Diary } from '../../../interfaces/diary.interface'
import { User } from "../../../interfaces/user.interface";
import { handleErrors } from "../server";

export const addDiary = (schema: any, req: Request): { user: User, diary: Diary } | Response => {
    try {
        const { title, type, userId } = JSON.parse(req.requestBody) as Partial<Diary>

        const exUser = schema.users.findBy({ id: userId })

        if (!exUser) return handleErrors('No such user exists.')

        const now = dayjs().format()
        // const now = dayjs().format('ddd, MMM D, YYYY h:mm A')

        const diaryObj = {
            title,
            type,
            userId,
            createdAt: now,
            updatedAt: now
        }

        const diary = exUser.createDiary(diaryObj)

        return {
            user: exUser.attrs,
            diary: diary.attrs as Diary
        }
    } catch (err) {
        return handleErrors('failed to create a diary.')
    }
}

export const updateDiary = (schema: any, req: Request): Diary | Response => {
    try {
        const diary = schema.diaries.find(req.params.diaryId)
        const data = JSON.parse(req.requestBody)

        const now = dayjs().format()
        // const now = dayjs().format('ddd, MMM D, YYYY h:mm A')

        const diaryObj = {
            ...data,
            updatedAt: now
        }

        diary.update(diaryObj)

        return diary.attrs as Diary
    } catch (err) {
        return handleErrors('Failed to update the diary')
    }
}

export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
    try {
        const user = schema.users.find(req.params.userId)

        return user.diary as Diary[]
    } catch (err) {
        return handleErrors('Unable to fetch the diaries')
    }
}