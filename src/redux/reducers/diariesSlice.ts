import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Diary } from '../../interfaces/diary.interface'

const diaries = createSlice({
    name: 'diaries',
    initialState: [] as Diary[],
    reducers: {
        addDiary: (state, { payload }: PayloadAction<Diary>) => {
            state.unshift(payload)
        },
        addAll: (state, { payload }: PayloadAction<Diary[] | null>) => {
            return state = payload != null ? payload : []
        },
        updateDiary: (state, {payload}: PayloadAction<Diary>) => {
            const { id } = payload
            const diaryIndex = state.findIndex(diary => diary.id === id)
            if(diaryIndex !== -1) {
                state.splice(diaryIndex, 1)
                state.unshift(payload)
            }
        },
    }
})

export const { addDiary, addAll, updateDiary } = diaries.actions
export default diaries.reducer