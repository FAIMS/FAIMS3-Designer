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
    //str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = 'ãàáäâáº½èéëêìíïîõòóöôùúüûñç·/_,:;';
    const to = 'aaaaaeeeeeiiiiooooouuuunc------';
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
        .replace(/[^A-Za-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};



export const uiSpecificationReducer = createSlice({
    name: 'ui-specification',
    initialState: initialState["ui-specification"],
    reducers: {
        loaded: (_state: NotebookUISpec, action: PayloadAction<NotebookUISpec>) => {
            return action.payload;
        },
        sectionNameUpdated: (state: NotebookUISpec,
            action: PayloadAction<{ viewId: string, label: string }>) => {
            const { viewId, label } = action.payload;
            console.log('updating section name', viewId, 'with', label);
            if (viewId in state.fviews) {
                state.fviews[viewId].label = label;
            } else {
                throw new Error(`Can't update unknown section ${viewId} via sectionNameUpdated action`);
            }
        },
        fieldUpdated: (state: NotebookUISpec,
            action: PayloadAction<{ fieldName: string, newField: FieldType }>) => {
            const { fieldName, newField } = action.payload;
            console.log('updating field', fieldName, 'with', newField);
            if (fieldName in state.fields) {
                state.fields[fieldName] = newField;
            } else {
                throw new Error(`Cannot update unknown field ${fieldName} via fieldUpdated action`);
            }
        },
        fieldMoved: (state: NotebookUISpec,
            action: PayloadAction<{ fieldName: string, viewId: string, direction: 'up' | 'down' }>) => {

            const { fieldName, viewId, direction } = action.payload;
            // this involves finding the field in the list of fields in the view
            // and moving it up or down one
            const fieldList = state.fviews[viewId].fields;
            for (let i = 0; i < fieldList.length; i++) {
                if (fieldList[i] == fieldName) {
                    if (direction === 'up') {
                        if (i > 0) {
                            const tmp = fieldList[i - 1];
                            fieldList[i - 1] = fieldList[i];
                            fieldList[i] = tmp;
                        }
                    } else {
                        if (i < fieldList.length - 1) {
                            const tmp = fieldList[i + 1];
                            fieldList[i + 1] = fieldList[i];
                            fieldList[i] = tmp;
                        }
                    }
                    // we're done
                    break;
                }
            }
            state.fviews[viewId].fields = fieldList;
        },
        fieldRenamed: (state: NotebookUISpec,
            action: PayloadAction<{ viewId: string, fieldName: string, newFieldName: string }>) => {

            const { viewId, fieldName, newFieldName } = action.payload;
            if (fieldName in state.fields) {
                const field = state.fields[fieldName];

                // ensure newFieldName is unique
                let fieldLabel = slugify(newFieldName);
                let N = 1;
                while (fieldLabel in state.fields) {
                    fieldLabel = slugify(fieldName + ' ' + N);
                    N += 1;
                }

                field['component-parameters'].name = fieldLabel;
                state.fields[fieldLabel] = field;
                delete state.fields[fieldName];
                // replace reference in the view
                const viewFields = state.fviews[viewId].fields;
                for (let i = 0; i < viewFields.length; i++) {
                    if (viewFields[i] === fieldName) {
                        viewFields[i] = fieldLabel;
                        break;
                    }
                }
                console.log('renamed field', fieldName, 'to', newFieldName, 'in view', viewId);
                console.log(viewFields);
            } else {
                throw new Error(`Cannot rename unknown field ${fieldName} via fieldRenamed action`);
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

            const newField: FieldType = getFieldSpec(fieldType);

            let fieldLabel = slugify(fieldName);

            // some field types need to be modified with extra info
            if (fieldType === 'RelatedRecordSelector') {
                // need to set the related type to the form id
                newField['component-parameters'].related_type = viewSetId;
                newField['component-parameters'].related_type_label = state.viewsets[viewSetId].label;
            }

            if (fieldType === 'BasicAutoIncrementer') {
                newField['component-parameters'].form_id = viewId;
            }

            if (fieldType === 'TemplatedStringField') {
                // if there is no existing HRID field in this form, then
                // this field becomes one by getting a name starting 'hrid'
                let hasHRID = false;
                for (const fieldName of state.fviews[viewId].fields) {
                    if (fieldName.startsWith('hrid') && fieldName.endsWith(viewId)) {
                        hasHRID = true;
                        break;
                    }
                }
                if (!hasHRID) {
                    fieldLabel = 'hrid' + viewId;
                }
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
            // try to set the field label
            if (newField['component-parameters'] && 'label' in newField['component-parameters']) {
                newField['component-parameters'].label = fieldName;
            } else if ('InputLabelProps' in newField['component-parameters'] &&
                newField['component-parameters'].InputLabelProps &&
                'label' in newField['component-parameters'].InputLabelProps) {
                newField['component-parameters'].InputLabelProps.label = fieldName;
            }

            // ensure a unique field name
            let N = 1;
            while (fieldLabel in state.fields) {
                fieldLabel = slugify(fieldName + ' ' + N);
                N += 1;
            }
            console.log('adding field', fieldLabel, 'to', viewId, 'as', newField);
            newField['component-parameters'].name = fieldLabel;
            // add to fields and to the fview section
            state.fields[fieldLabel] = newField;
            state.fviews[viewId].fields.push(fieldLabel);

        },
        fieldDeleted: (state: NotebookUISpec,
            action: PayloadAction<{ fieldName: string, viewId: string }>) => {
            const { fieldName, viewId } = action.payload;
            // remove the field from fields and the viewSet
            if (fieldName in state.fields) {
                delete state.fields[fieldName];
                const newView = state.fviews[viewId].fields.filter((field) => field !== fieldName);
                state.fviews[viewId].fields = newView;
            } else {
                throw new Error(`Cannot delete unknown field ${fieldName} via fieldDeleted action`);
            }
        },
        viewSetAdded: (state: NotebookUISpec,
            action: PayloadAction<{ formName: string }>) => {
            const { formName } = action.payload;
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
                state.visible_types.push(formID);
            }
        },
        viewSetDeleted: (state: NotebookUISpec, action: PayloadAction<{ viewSetId: string }>) => {
            const { viewSetId } = action.payload;

            if (viewSetId in state.viewsets) {
                // working copy of the section names ('views') part of the form that is to be removed
                const viewSetViews: string[] = state.viewsets[viewSetId].views
                viewSetViews.map((view) => {
                    if (view in state.fviews) {
                        // working copy of the field names ('fields') part of the section that is part of the form that is to be removed
                        const fviewFields: string[] = state.fviews[view].fields
                        fviewFields.map((formField) => {
                            if (formField in state.fields) {
                                // remove the fields in 'fields' belonging to their respective sections in the form
                                delete state.fields[formField]
                            }
                        })
                        // remove the sections in 'fviews' belonging to the form 
                        delete state.fviews[view];
                    }
                })
                // remove the form from 'viewsets' and 'visible_types'
                delete state.viewsets[viewSetId];
                const newVisibleTypes = state.visible_types.filter((field) => field !== viewSetId);
                state.visible_types = newVisibleTypes;
            }
        },
        formSectionAdded: (state: NotebookUISpec,
            action: PayloadAction<{ viewSetId: string, sectionLabel: string }>) => {
            const { viewSetId, sectionLabel } = action.payload;
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
        },
        formSectionDeleted: (state: NotebookUISpec, action: PayloadAction<{ viewSetID: string, viewID: string }>) => {
            const { viewSetID, viewID } = action.payload;

            if (viewID in state.fviews) {
                // working copy of the field names ('fields') part of the section that is to be removed
                const sectionFields: string[] = state.fviews[viewID].fields
                sectionFields.map((field) => {
                    if (field in state.fields) {
                        // remove the fields in 'fields' belonging to the section 
                        delete state.fields[field];
                    }
                })
                // remove the section from 'fviews' & 'viewsets'
                delete state.fviews[viewID];
                const newViewSetViews = state.viewsets[viewSetID].views.filter((view) => view !== viewID);
                state.viewsets[viewSetID].views = newViewSetViews;
            }
        }
    }
})

export const { loaded, fieldUpdated } = uiSpecificationReducer.actions;

export default uiSpecificationReducer.reducer;

