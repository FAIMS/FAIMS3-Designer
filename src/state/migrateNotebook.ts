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

import {FieldType, Notebook} from "./initial";

/**
 * Migrate a notebook to the most recent notebook format
 * @param notebook - a notebook object that may be out of date
 * @returns an updated version of the same notebook
 * 
 * TODO: type of input is not really a notebook if we update that type
 */
export const migrateNotebook = (notebook: Notebook) => {

    const notebookCopy = JSON.parse(JSON.stringify(notebook)) as Notebook;  // deep copy
    // move field labels from old locations to .label
    updateFieldLabels(notebookCopy);

    // update format of annotation settings
    updateAnnotationFormat(notebookCopy);

    // change `helpertext` in `TakePhoto` to `helperText`
    updateHelperText(notebookCopy);

    return notebookCopy;
};

/**
 * Update notebook fields so that labels are directly on component-parameters
 * 
 * @param notebook A notebook that might be out of date, modified
 */
const updateFieldLabels = (notebook: Notebook) => {

    const fields : {[key: string]: FieldType} = {};

    for(const fieldName in notebook['ui-specification'].fields) {
        const field = notebook['ui-specification'].fields[fieldName];

        // clean up all the different ways that label could be stored
        const params = field['component-parameters'];
        if (params?.label) fields[fieldName] = {...field};
        else if (params?.InputLabelProps?.label) {
            params.label = params.InputLabelProps.label;
            delete params.InputLabelProps;
        } else if (params?.FormControlLabelProps?.label) {
            params.label = params.FormControlLabelProps.label;
            delete params.FormControlLabelProps;
        } else if (params?.FormLabelProps?.children) {
            params.label = params.FormLabelProps.children;
            delete params.FormLabelProps;
        } else if (params?.name) {
            params.label = params.name;
        }
        fields[fieldName] = {
            ...field,
            "component-parameters": params,
        };
    }
    notebook['ui-specification'].fields = fields;
}


/**
 * Update a notebook to use the newer annotation field specification
 * 
 * @param notebook A notebook that might be out of date, modified
 */
const updateAnnotationFormat = (notebook: Notebook) => {

    const fields : {[key: string]: FieldType} = {};

    for(const fieldName in notebook['ui-specification'].fields) {
        const field = notebook['ui-specification'].fields[fieldName];
        if (typeof(field.meta?.annotation) === 'boolean') {
            field.meta.annotation = {
                include: field.meta?.annotation,
                label: field.meta?.annotation_label || 'Annotation'
            };
            if (field.meta?.annotation_label) delete field.meta.annotation_label;
            fields[fieldName] = field;
        }
    }

    notebook['ui-specification'].fields = fields;
}

/**
 * Update a notebook to use consistent helperText properties
 * 
 * @param notebook A notebook that might be out of date, modified
 */
const updateHelperText = (notebook: Notebook) => {

    const fields : {[key: string]: FieldType} = {};

    for(const fieldName in notebook['ui-specification'].fields) {
        const field = notebook['ui-specification'].fields[fieldName];
       
        const params = field['component-parameters'];
        const originalValue = params?.helperText;
        // TakePhoto used to use this]
        if (params?.helpertext) {
            params.helperText = originalValue || params.helpertext;
            delete params.helpertext;
        } else if (params?.FormHelperTextProps) {
            params.helperText = originalValue || params.FormHelperTextProps.children;
            delete params.FormHelperTextProps;
        }

        fields[fieldName] = field;
    }

    notebook['ui-specification'].fields = fields;
}


