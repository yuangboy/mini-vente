import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IUser } from '../interface';


interface UserState{
    user:  IUser| null;
    isEmailVerified: boolean;
    isLoginDialogOpen: boolean;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    user: null,
    isEmailVerified: false,
    isLoginDialogOpen: false,
    isLoggedIn: false,
}

const userSlice=createSlice({
    name: 'user',
   initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload;
        },
        setEmailVerified: (state, action: PayloadAction<boolean>) => {
            state.isEmailVerified = action.payload;
        },

        logout: (state)=>{
            state.user = null;
            state.isEmailVerified = false;
            state.isLoggedIn = false;
        },
        toogleLoginInDialog: (state) => {
            state.isLoginDialogOpen=!state.isLoginDialogOpen;
        },
        authStatus: (state) => {
            state.isLoggedIn = !state.isLoggedIn;
        },
    }
});

export const { setUser, setEmailVerified, toogleLoginInDialog, logout,authStatus } = userSlice.actions;
export default userSlice.reducer;