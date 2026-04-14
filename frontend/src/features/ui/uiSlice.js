import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,

    alert: {
        open: false,
        title: "",
        message: "",
        type: "info", // info | warning
    },

    confirm: {
        open: false,
        message: "",
        onConfirm: null,
    },
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        // 🔹 Loader
        startLoading: (state) => {
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loading = false;
        },

        // 🔹 Alert
        showAlert: (state, action) => {
            state.alert = {
                open: true,
                ...action.payload,
            };
        },
        closeAlert: (state) => {
            state.alert.open = false;
        },

        // 🔹 Confirm
        showConfirm: (state, action) => {
            state.confirm = {
                open: true,
                ...action.payload,
            };
        },
        closeConfirm: (state) => {
            state.confirm.open = false;
            state.confirm.onConfirm = null;
        },
    },
});

export const {
    startLoading,
    stopLoading,
    showAlert,
    closeAlert,
    showConfirm,
    closeConfirm,
} = uiSlice.actions;

export default uiSlice.reducer;