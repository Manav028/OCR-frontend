import { configureStore } from "@reduxjs/toolkit";
import ocrReducer from './ocrtext/OcrTextSlice'

export const store = configureStore({
    reducer : ocrReducer
});

