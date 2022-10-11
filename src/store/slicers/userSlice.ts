import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import { UserInfo } from '@/app_models/user'

export interface UserState {
  UserInfo: UserInfo
}

const initialState: UserState = {
  UserInfo: {
    businessName: '',
    businessId: '',
    businessPermission: [],
    phone: '',
    permission: [],
    token: '',
    name: ''
  }
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUserInfo: (state, action) => {
      state.UserInfo = { ...state.UserInfo, ...action.payload }
    },
    initUserInfo: (state) => {
      state.UserInfo = initialState.UserInfo
    }
  }
})

export const { setUserInfo, initUserInfo } = userSlice.actions

export const selectUserInfo = (state: RootState) => state.user.UserInfo

export default userSlice.reducer
