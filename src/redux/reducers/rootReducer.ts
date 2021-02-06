import { combineReducers } from "redux";
import authReducer from './authSlice'
import userReducer from './userSlice'
import diariesReducer from './diariesSlice'
import entriesReducer from './entriesSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    diaries: diariesReducer,
    entries: entriesReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer