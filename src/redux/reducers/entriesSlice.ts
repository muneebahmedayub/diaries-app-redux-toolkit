import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Entry } from '../../interfaces/entry.interface'

const entry = createSlice({
    name: 'entry',
    initialState: [] as Entry[],
    reducers: {
        addEntry: (state, { payload }: PayloadAction<Entry>) => {
            state.unshift(payload)
        },
        setEntry: (state, { payload }: PayloadAction<Entry[] | null>) => {
            return state = payload !== null ? payload : []
        },
        updateEntry: (state, { payload }: PayloadAction<Entry>) => {
            const { id } = payload
            const entryIndex = state.findIndex(entry => entry.id === id)
            if(entryIndex !== -1) {
                state.splice(entryIndex, 1)
                state.unshift(payload)
            }
        }
    }
})

export const { addEntry, setEntry, updateEntry } = entry.actions
export default entry.reducer