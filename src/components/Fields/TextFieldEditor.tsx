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
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { BaseFieldEditor } from "./BaseFieldEditor";

export const TextFieldEditor = ({ fieldName }: any) => {
    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const initVal = field['initialValue']

    const updateDefault = (value: string) => {
        const newField = JSON.parse(JSON.stringify(field));
        newField['initialValue'] = value;
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const updateMinControl = (value: number) => {
        const newField = JSON.parse(JSON.stringify(field));
        newField['validationSchema'][1][1] = value;

        console.log('hi ', field['component-parameters'].id)
        if (field['component-parameters'].id === 'controlled-number') {
            newField['validationSchema'][1][2] = "Must be " + value + " or more"
        }

        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const updateMaxControl = (value: number) => {
        const newField = JSON.parse(JSON.stringify(field));
        newField['validationSchema'][2][1] = value;

        if (field['component-parameters'].id === 'controlled-number') {
            newField['validationSchema'][2][2] = "Must be " + value + " or less"
        }

        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    return (
        <BaseFieldEditor fieldName={fieldName}>
            {/* only show this config if we want a prepop text field */}
            {(field['component-parameters'].id === 'text-field-prepop') &&
                <Grid item sm={6} xs={12}>
                    <TextField
                        name="prepopulated"
                        variant="outlined"
                        label="Default Text"
                        value={initVal}
                        helperText="Choose this field's default."
                        onChange={(e) => { updateDefault(e.target.value) }}
                    />
                </Grid>
            }

            {(field['component-parameters'].id === 'controlled-number' || field['component-parameters'].id === 'number-field-val') &&
                <>
                    <Grid item sm={6}>
                        <TextField
                            name="min"
                            variant="outlined"
                            label="Min Control"
                            type="number"
                            helperText="What is the min this number must be?"
                            onChange={(e) => { updateMinControl(parseInt(e.target.value)) }}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField
                            name="controlled-number"
                            variant="outlined"
                            label="Max Control"
                            type="number"
                            helperText="What is the max this number can be?"
                            onChange={(e) => { updateMaxControl(parseInt(e.target.value)) }}
                        />
                    </Grid>
                </>
            }
        </BaseFieldEditor>
    )
};