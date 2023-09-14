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

import { Card, Grid, TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { BaseFieldEditor } from "./BaseFieldEditor";

export const TextFieldEditor = ({ fieldName }: any) => {
    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const initVal: (string | number) = field['initialValue']
    const subType: string = field['component-parameters'].InputProps.type
    const schema: (string | number)[] = field['validationSchema']

    // flattens the validationSchema array of arrays so that I can run the .includes() function on it
    const validationArr: (string | number)[] = schema.flat()
    // flag to tell us if we're dealing with controlled-number / number-field-val
    let hasMinMax = false;
    if (validationArr.includes('yup.min') && validationArr.includes('yup.max')) {
        hasMinMax = true;
    }

    const updateDefault = (value: string | number) => {
        const newField = JSON.parse(JSON.stringify(field));
        newField['initialValue'] = value;
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    // updates the min or max clause in the validationSchema
    const updateSchema = (schema: (string | number)[], functor: string, ...args: any[]) => {
        return schema.map((item: any, index) => {
            // check if the first element of the subarray is the clause we want to update
            if (item[0] === functor) {
                const newField = JSON.parse(JSON.stringify(field));
                newField['validationSchema'][index] = [functor, ...args]
                dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
            } else {
                return item
            }
        })
    };

    const updateMinControl = (value: number) => {
        updateSchema(schema, "yup.min", value, "Must be " + value + " or more")
    }

    const updateMaxControl = (value: number) => {
        updateSchema(schema, "yup.max", value, "Must be " + value + " or less")
    }

    return (
        <BaseFieldEditor fieldName={fieldName}>
            {/* config option to add a default value for plain text fields */}
            {(subType === 'string') &&
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ display: 'flex' }}>
                        <Grid item xs={12} sx={{ mx: 1.5, my: 2 }}>
                            <TextField
                                name="prepopulated"
                                variant="outlined"
                                label="Default Text"
                                value={initVal}
                                helperText="Choose this field's default text."
                                onChange={(e) => { updateDefault(e.target.value) }}
                            />
                        </Grid>
                    </Card>
                </Grid>
            }

            {/* config option to add a default value for number fields */}
            {(subType === 'number') &&
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ display: 'flex' }}>
                        <Grid item xs={12} sx={{ mx: 1.5, my: 2 }}>
                            <TextField
                                name="prepopulated"
                                variant="outlined"
                                label="Default Number"
                                type="number"
                                value={initVal}
                                helperText="Choose this field's default number."
                                onChange={(e) => { updateDefault(parseFloat(e.target.value)) }}
                            />
                        </Grid>
                    </Card>
                </Grid>
            }

            {/* config option to add min and max controls for controlled number fields */}
            {hasMinMax &&
                <Grid item xs={6}>
                    <Card variant="outlined" sx={{ display: 'flex' }}>
                        <Grid item xs={12} sx={{ mx: 1.5, my: 2 }}>
                            <TextField
                                name="min"
                                variant="outlined"
                                label="Min Control"
                                type="number"
                                helperText="Min this number must be."
                                onChange={(e) => { updateMinControl(parseFloat(e.target.value)) }}
                            />

                        </Grid>
                        <Grid item xs={12} sx={{ mx: 1.5, my: 2 }}>
                            <TextField
                                name="max"
                                variant="outlined"
                                label="Max Control"
                                type="number"
                                helperText="Max this number can be."
                                onChange={(e) => { updateMaxControl(parseFloat(e.target.value)) }}
                            />
                        </Grid>
                    </Card>
                </Grid>
            }
        </BaseFieldEditor>
    )
};