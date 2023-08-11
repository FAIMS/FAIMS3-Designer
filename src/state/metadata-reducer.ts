import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, NotebookMetadata} from "./initial";

const protectedFields = ['meta', 'project_status', 'access', 'accesses', 
                         'forms', 'filenames', 'ispublic', 'isrequest', 'sections'];

const metadataReducer = createSlice({
    name: 'metadata',
    initialState:  initialState.metadata,
    reducers: {
        loaded: (state: NotebookMetadata, action: PayloadAction<NotebookMetadata>) => {
            return action.payload;
        },
        propertyUpdated: (state: NotebookMetadata, action: PayloadAction<{property: string, value: string}>) => {
            const { property, value } = action.payload;
            if (protectedFields.includes(property)) {
                throw new Error(`Cannot update protected metadata field ${property} via propertyUpdated action`);
            } else {
                state[property] = value;
            }
        },
        rolesUpdated: (state: NotebookMetadata, action: PayloadAction<{roles: string[]}>) => {
            const { roles } = action.payload;
            state.accesses = roles;
        },
    }
})

export const { loaded, propertyUpdated, rolesUpdated } = metadataReducer.actions;

export default metadataReducer.reducer;

