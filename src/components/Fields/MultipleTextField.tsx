// Copyright 2023 Google LLC
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

import { Grid, Card, TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { BaseFieldEditor } from "./BaseFieldEditor";

const sample = {
    "component-namespace": "formik-material-ui",
    "component-name": "MultipleTextField",
    "type-returned": "faims-core::String",
    "component-parameters":
    {
        "fullWidth": true,
        "helperText": "Enter a detailed description of the feature",
        "variant": "outlined",
        "required": false,
        "multiline": true,
        "InputProps":
        {
            "type": "text",
            "rows": 4
        },
        "SelectProps": {},
        "InputLabelProps": { "label": "Feature Description" },
        "FormHelperTextProps": {},
        "id": "newfieldc25e8929",
        "name": "newfieldc25e8929"
    },
    "validationSchema": [["yup.string"]],
    "initialValue": "",
    "access": ["admin"],
    "meta":
    {
        "annotation_label": "annotation",
        "annotation": true,
        "uncertainty":
        {
            "include": false,
            "label": "uncertainty"
        }
    }
};

const couldBe = {
    "id": "newfieldc25e8929",
    "label": "Feature Description", /* EDIT */
    "componentNamespace": "formik-material-ui",
    "componentName": "MultipleTextField",
    "typeReturned": "faims-core::String",
    "helperText": "Enter a detailed description of the feature", /* EDIT */
    "required": false, /* EDIT */
    "rows": 4, /* EDIT */
    "validationSchema": [["yup.string"]],
    "initialValue": "",
    "access": ["admin"],
    "annotation": true, /* EDIT */
    "uncertainty": false, /* EDIT */
};

export const MultipleTextFieldEditor = ({ fieldName }: any) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const rows = field['component-parameters'].InputProps.rows || 4;

    const updateRows = (value: number) => {
        const newField = JSON.parse(JSON.stringify(field)); // deep copy
        newField['component-parameters'].InputProps.rows = value;
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    return (
        <BaseFieldEditor fieldName={fieldName}>
            <Grid item sm={6} xs={12}>
                <Card variant="outlined" sx={{ display: 'flex' }}>
                    <Grid item xs={12} sx={{ mx: 1.5, my: 2 }}>
                        <TextField
                            name="rows"
                            variant="outlined"
                            label="Rows to display"
                            type="number"
                            value={rows}
                            helperText="Number of rows in the text field."
                            onChange={(e) => updateRows(parseInt(e.target.value))}
                        />
                    </Grid>
                </Card>
            </Grid>
        </BaseFieldEditor>
    )
    
};