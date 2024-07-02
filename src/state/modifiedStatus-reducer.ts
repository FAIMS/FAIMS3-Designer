// Copyright 2023 FAIMS Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState, NotebookModified } from "./initial";
import {propertyUpdated, rolesUpdated} from "./metadata-reducer";
import {fieldAdded, fieldDeleted, fieldMoved, fieldRenamed, fieldUpdated, formVisibilityUpdated, sectionAdded, sectionConditionChanged, sectionDeleted, sectionMoved, sectionRenamed, viewSetAdded, viewSetDeleted, viewSetMoved, viewSetRenamed} from "./uiSpec-reducer";

const modifiedStatusReducer = createSlice({
    name: 'modifiedStatus',
    initialState:  initialState.modifiedStatus,
    reducers: {
        resetFlag: (state: NotebookModified, action: PayloadAction<{newStatus: boolean}>) => {
            const { newStatus } = action.payload;
            console.log("Reached modified reducer " + newStatus);
            state.flag = newStatus;
        },
    },
    extraReducers: builder => {
        //Metadata reducers
        builder.addCase(propertyUpdated, (state) => {
            state.flag = true;
        })
        .addCase(rolesUpdated, (state) => {
            state.flag = true;
        })
        //UISpec reducers
        .addCase(fieldUpdated, (state) => {
            state.flag = true;
        })
        .addCase(fieldMoved, (state) => {
            state.flag = true;
        })
        .addCase(fieldRenamed, (state) => {
            state.flag = true;
        })
        .addCase(fieldAdded, (state) => {
            state.flag = true;
        })
        .addCase(fieldDeleted, (state) => {
            state.flag = true;
        })
        .addCase(sectionRenamed, (state) => {
            state.flag = true;
        })
        .addCase(sectionAdded, (state) => {
            state.flag = true;
        })
        .addCase(sectionDeleted, (state) => {
            state.flag = true;
        })
        .addCase(sectionMoved, (state) => {
            state.flag = true;
        })
        .addCase(sectionConditionChanged, (state) => {
            state.flag = true;
        })
        .addCase(viewSetAdded, (state) => {
            state.flag = true;
        })
        .addCase(viewSetDeleted, (state) => {
            state.flag = true;
        })
        .addCase(viewSetMoved, (state) => {
            state.flag = true;
        })
        .addCase(viewSetRenamed, (state) => {
            state.flag = true;
        })
        .addCase(formVisibilityUpdated, (state) => {
            state.flag = true;
        })
    }    
});

export const { resetFlag } = modifiedStatusReducer.actions;

export default modifiedStatusReducer.reducer;

