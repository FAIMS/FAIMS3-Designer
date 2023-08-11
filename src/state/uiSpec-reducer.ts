import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotebookUISpec, initialState } from "./initial";

export const uiSpecificationReducer = createSlice({
    name: 'ui-specification',
    initialState:  initialState["ui-specification"],
    reducers: {
        loaded: (state: NotebookUISpec, action: PayloadAction<NotebookUISpec>) => {
            return action.payload;
        },
        fieldUpdated: (state: NotebookUISpec, action: PayloadAction<{fieldName: string, newField: any}>) => {
            const { fieldName, newField } = action.payload;
            console.log('updating field', fieldName, 'with', newField);
            if (fieldName in state.fields) {
                state.fields[fieldName] = newField;
            } else {
                throw new Error(`Cannot update unknown field ${fieldName} via fieldUpdated action`);
            }
        }
    }
})

export const { loaded, fieldUpdated } = uiSpecificationReducer.actions;

export default uiSpecificationReducer.reducer;

