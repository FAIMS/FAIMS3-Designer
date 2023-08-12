import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NotebookUISpec, initialState } from "./initial";
import { getFieldSpec } from "../fields";


/**
 * Slugify a string, replacing special characters with less special ones
 * @param str input string
 * @returns url safe version of the string
 * https://ourcodeworld.com/articles/read/255/creating-url-slugs-properly-in-javascript-including-transliteration-for-utf-8
 */
const slugify = (str: string) => {
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
        loaded: (state: NotebookUISpec, action: PayloadAction<NotebookUISpec>) => {
            return action.payload;
        },
        fieldUpdated: (state: NotebookUISpec, 
                       action: PayloadAction<{fieldName: string, newField: any}>) => {
            const { fieldName, newField } = action.payload;
            console.log('updating field', fieldName, 'with', newField);
            if (fieldName in state.fields) {
                state.fields[fieldName] = newField;
            } else {
                throw new Error(`Cannot update unknown field ${fieldName} via fieldUpdated action`);
            }
        },
        fieldAdded: (state: NotebookUISpec, 
                     action: PayloadAction<{fieldName: string, fieldType: string, viewId: string}>) => {
            const { fieldName, fieldType, viewId } = action.payload;
            console.log('adding field', fieldName, 'to', viewId, 'type', fieldType);
            if (fieldName in state.fields) {
                // change the field name to be unique
                throw new Error(`Cannot add already existing field ${fieldName} via fieldAdded action`);
            } else {
                const newField = getFieldSpec(fieldType);
                // add in the meta field 
                newField.meta = {
                    "annotation": true,
                    "annotation_label": "annotation",
                    "uncertainty": {
                      "include": true,
                      "label": "uncertainty"
                    }
                };
                newField.name = fieldName;
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
        }
    }
})

export const { loaded, fieldUpdated } = uiSpecificationReducer.actions;

export default uiSpecificationReducer.reducer;

