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

import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { BaseFieldEditor } from "./BaseFieldEditor"
import { useAppSelector, useAppDispatch } from "../../state/hooks";

const sample = {
    "component-namespace": "faims-custom",
    "component-name": "Select",
    "type-returned": "faims-core::String",
    "component-parameters":{
        "fullWidth": true,
        "helperText": "This is the type of feature",
        "variant": "outlined",
        "required": false,
        "select": true,
        "InputProps": {},
        "SelectProps": {},
        "ElementProps":{
            "options":
            [
                {
                    "value": "Other ",
                    "label": "Other "
                },
                {
                    "value": "Metal Feature",
                    "label": "Metal Feature"
                },
                {
                    "value": "Masonry",
                    "label": "Masonry"
                },
                {
                    "value": "Rock cutting",
                    "label": "Rock cutting"
                },
                {
                    "value": "Hearth",
                    "label": "Hearth"
                },
                {
                    "value": "",
                    "label": ""
                }
            ]
        },
        "InputLabelProps":{ "label": "Feature Type" },
        "id": "newfield83238a4d",
        "name": "newfield83238a4d"
    },
    "validationSchema": [["yup.string"]],
    "initialValue": "",
    "access":["admin"],
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
}

export const SelectFieldEditor = ({fieldName}) => {
    
    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const getOptions = () => {
        let options = [];
        if (field['component-parameters'].ElementProps) {
            options = field['component-parameters'].ElementProps.options
            options = options.map(pair => pair.label.trim())
        } else {
            field['component-parameters'].ElementProps = {options: []}
        }
        return options.join(', ');
    }

    const [options, setOptions] = useState(getOptions())

    const updateProperty = (value: any) => {
        setOptions(value);
        const optionArray = value.split(',').map(v => v.trim());
        // take a deep copy of the field
        const newField = JSON.parse(JSON.stringify(field));
        newField['component-parameters'].ElementProps.options =
            optionArray.map(o => {return {label: o, value: o}})
        dispatch({type: 'ui-specification/fieldUpdated', payload: {fieldName, newField}})
    }

    return (
        <BaseFieldEditor fieldName={fieldName}>

                <Grid item sm={6} xs={12}>
                    <TextField 
                        name="options" 
                        variant="outlined"
                        label="Options"
                        fullWidth
                        multiline={true}
                        rows={4}
                        value={options}
                        onChange={(e) => updateProperty(e.target.value)} 
                        helperText="Add options here, use ',' to separate."
                    />
                </Grid>

        </BaseFieldEditor>
    )
}