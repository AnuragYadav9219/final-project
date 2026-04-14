import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    access: localStorage.getItem("access") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { access } = action.payload;
            state.access = access;
            localStorage.setItem("access", access);
        },

        logout: (state) => {
            state.user = null;
            state.access = null;
            localStorage.removeItem("access");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;