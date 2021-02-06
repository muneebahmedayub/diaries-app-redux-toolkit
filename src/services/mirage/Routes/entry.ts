import dayjs from "dayjs";
import { Request, Response } from "miragejs";
import { Entry } from "../../../interfaces/entry.interface";
import { Diary } from '../../../interfaces/diary.interface'
import { handleErrors } from "../server";

export const addEntry = (schema: any, req: Request): {diary: Diary, entry: Entry} | Response => {
    try {
        const diary = schema.diaries.find(req.params.diaryId)
        const {title, content} = JSON.parse(req.requestBody) as Partial<Entry>
        const now = dayjs().format()
    
        const entryObj = {
            title,
            content,
            createdAt: now,
            updatedAt: now,
        }
    
        const entry = diary.createEntry(entryObj)
    
        return {
            diary: diary.attrs,
            entry: entry.attrs
        }
    } catch (err) {
        return handleErrors('Failed to create entry')
    }
}

export const updateEntry = (schema: any, req: Request): Entry | Response => {
    try {
        const entry = schema.entries.find(req.params.entryId)
        const data = JSON.parse(req.requestBody) as Partial<Entry>
        const now = dayjs().format()

        const entryObj = {
            ...data,
            updatedAt: now
        }

        entry.update(entryObj)

        return entry.attrs as Entry
    } catch (err) {
        return handleErrors('Failed to update the entry')
    }
}

export const getEntries = (schema: any, req: Request): Entry[] | Response => {
    try {
        const diary = schema.diaries.find(req.params.diaryId)
        
        return diary.entry as Entry[]
    } catch (err) {
        return handleErrors('Failed to fetch the entries')
    }
}