import { createSlice, nanoid } from "@reduxjs/toolkit";

interface OCRState {
    extractedText: string | null;
}

const initialState: OCRState = {
    extractedText: null
}

const ocrSlice = createSlice({
    name: 'ocrText',
    initialState,
    reducers: {
        SetOCRText: (state, action) => {
            state.extractedText = action.payload;
        },
        RemoveOCRText: (state, action) => {
            state.extractedText = null;
        }
    },
});

export const {SetOCRText , RemoveOCRText} = ocrSlice.actions;

export default ocrSlice.reducer