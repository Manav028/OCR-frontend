import { createSlice } from "@reduxjs/toolkit";

interface OCRState {
    imagePath: string | null;
    extractedText: string | null;
}

const initialState: OCRState = {
    imagePath: null,
    extractedText: null,
};

const ocrSlice = createSlice({
    name: 'ocr',
    initialState,
    reducers: {
        SetOCRData: (state, action) => {
            state.imagePath = action.payload.imagePath;
            state.extractedText = action.payload.extractedText;
        },
        RemoveOCRData: (state) => {
            state.imagePath = null;
            state.extractedText = null;
        },
    },
});

export const { SetOCRData, RemoveOCRData } = ocrSlice.actions;

export default ocrSlice.reducer;
