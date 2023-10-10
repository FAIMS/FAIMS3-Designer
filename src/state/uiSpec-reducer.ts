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

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotebookUISpec, initialState, FieldType } from "./initial";
import { getFieldSpec } from "../fields";



/**
 * Slugify a string, replacing special characters with less special ones
 * @param str input string
 * @returns url safe version of the string
 * https://ourcodeworld.com/articles/read/255/creating-url-slugs-properly-in-javascript-including-transliteration-for-utf-8
 */
export const slugify = (str: string) => {
    str = str.trim();
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    const from = 'ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;';
    const to = 'aaaaaeeeeeiiiiooooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  
    return str;
  };



export const uiSpecificationReducer = createSlice({
    name: 'ui-specification',
    initialState:  initialState["ui-specification"],
    reducers: {
        loaded: (_state: NotebookUISpec, action: PayloadAction<NotebookUISpec>) => {
            return action.payload;
        },
        sectionNameUpdated: (state: NotebookUISpec,
            action : PayloadAction<{viewId: string, label: string}>) => {
                const { viewId, label } = action.payload;
                console.log('updating section name', viewId, 'with', label);
                if (viewId in state.fviews) {
                    state.fviews[viewId].label = label;
                } else {
                    throw new Error(`Can't update unknown section ${viewId} via sectionNameUpdated action`);
                }
            },
        fieldUpdated: (state: NotebookUISpec, 
                       action: PayloadAction<{fieldName: string, newField: FieldType}>) => {
            const { fieldName, newField } = action.payload;
            console.log('updating field', fieldName, 'with', newField);
            if (fieldName in state.fields) {
                state.fields[fieldName] = newField;
            } else {
                throw new Error(`Cannot update unknown field ${fieldName} via fieldUpdated action`);
            }
        },
        fieldAdded: (state: NotebookUISpec, 
                     action: PayloadAction<{
                        fieldName: string, 
                        fieldType: string, 
                        viewId: string,
                        viewSetId: string
                    }>) => {
            const { fieldName, fieldType, viewId, viewSetId } = action.payload;
            console.log('adding field', fieldName, 'to', viewSetId, '-', viewId, 'type', fieldType);
            if (fieldName in state.fields) {
                // change the field name to be unique
                throw new Error(`Cannot add already existing field ${fieldName} via fieldAdded action`);
            } else {
                const newField: FieldType = getFieldSpec(fieldType);
                // some field types need to be modified with extra info

                if (fieldType === 'RelatedRecordSelector') {
                    // need to set the related type to the form id
                    newField['component-parameters'].related_type = viewSetId;
                    newField['component-parameters'].related_type_label = state.viewsets[viewSetId].label;
                }

                if (fieldType === 'BasicAutoIncrementer') {
                    newField['component-parameters'].form_id = viewId;
                }

                // add in the meta field 
                newField.meta = {
                    "annotation": true,
                    "annotation_label": "annotation",
                    "uncertainty": {
                      "include": true,
                      "label": "uncertainty"
                    }
                };
                newField['component-parameters'].name = fieldName;
                let fieldLabel = slugify(fieldName);
                let N = 1;
                while(fieldLabel in state.fields) { 
                    fieldLabel = slugify(fieldName + ' ' + N);
                    N += 1;
                }
                console.log('adding field', fieldLabel, 'to', viewId, 'as', newField);
                // add to fields and to the fview section
                state.fields[fieldLabel] = newField;
                state.fviews[viewId].fields.push(fieldLabel);
            }
        },
        viewSetAdded: (state: NotebookUISpec,
                       action: PayloadAction<{formName: string}>) => {
                            const {formName} = action.payload;
                            const newViewSet = {
                                label: formName,
                                views: []
                            };
                            const formID = slugify(formName);
                            // add this to the viewsets
                            if (formID in state.viewsets) {
                                throw new Error(`Form ${formID} already exists in notebook`);
                            } else {
                                state.viewsets[formID] = newViewSet;
                            }
                       },
        formSectionAdded: (state: NotebookUISpec,
            action: PayloadAction<{viewSetId: string, sectionLabel: string}>) => {
                const {viewSetId, sectionLabel} = action.payload;
                const sectionId = viewSetId + '-' + slugify(sectionLabel);
                const newSection = {
                    label: sectionLabel,
                    fields: []
                };
                if (sectionId in state.fviews) {
                    throw new Error(`Section ${sectionLabel} already exists in this form.`);
                } else {
                    state.fviews[sectionId] = newSection;
                    state.viewsets[viewSetId].views.push(sectionId);
                }
            }
    }
})

export const { loaded, fieldUpdated } = uiSpecificationReducer.actions;

export default uiSpecificationReducer.reducer;

