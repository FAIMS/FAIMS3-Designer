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

import { Checkbox, FormControlLabel, Grid, TextField, Card } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { FieldType, Notebook } from "../../state/initial";

type Props = {
    fieldName: string,
    children?: React.ReactNode
}

// gets rid of the type error in updateFieldFromState func
type StateType = {
    label?: string,
    helperText: string,
    required: boolean,
    annotation: boolean,
    annotationLabel: string,
    uncertainty: boolean,
    uncertaintyLabel: string
}

export const BaseFieldEditor = ({ fieldName, children }: Props) => {

    const field = useAppSelector((state: Notebook) => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    // These are needed because there is no consistency in how
    // the field label is stored in the notebook
    const getFieldLabel = () => {
        return (field['component-parameters'] && field['component-parameters'].label) ||
            (field['component-parameters'].InputLabelProps && field['component-parameters'].InputLabelProps.label) ||
            field['component-parameters'].name;
    }

    const setFieldLabel = (newField: FieldType, label: string) => {
        if (newField['component-parameters'].label)
            newField['component-parameters'].label = label;
        if (newField['component-parameters'].InputLabelProps && newField['component-parameters'].InputLabelProps.label)
            newField['component-parameters'].InputLabelProps.label = label;
        if (newField['component-parameters'].name)
            newField['component-parameters'].name = label;
    }

    const updateField = (fieldName: string, newField: FieldType) => {
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const cParams = field['component-parameters'];

    const state = {
        label: getFieldLabel(),
        helperText: cParams.helperText || "",
        required: cParams.required || false,
        annotation: field.meta ? field.meta.annotation || false : false,
        annotationLabel: field.meta ? field.meta.annotation_label || '' : '',
        uncertainty: field.meta ? field.meta.uncertainty.include || false : false,
        uncertaintyLabel: field.meta ? field.meta.uncertainty.label || '' : '',
    };

    const updateFieldFromState = (newState: StateType) => {
        const newField = JSON.parse(JSON.stringify(field)) as FieldType; // deep copy
        if (newState.label) 
            setFieldLabel(newField, newState.label);
        newField['component-parameters'].helperText = newState.helperText;
        newField['component-parameters'].required = newState.required;
        if (newField.meta) {
            if (newState.annotation) {
                newField.meta.annotation = newState.annotation;
                newField.meta.annotation_label = newState.annotationLabel || '';
            }
            if (newState.uncertainty) {
                newField.meta.uncertainty = {
                    include: newState.uncertainty,
                    label: newState.uncertaintyLabel || ''
                }
            }
        }
        updateField(fieldName, newField);
    };

    const updateProperty = (prop: string, value: string | boolean) => {
        const newState: StateType = { ...state, [prop]: value };
        updateFieldFromState(newState);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Card variant="outlined" sx={{ display: 'flex' }}>
                    <Grid item sm={6} xs={12} sx={{ mx: 1.5, my: 2 }}>
                        <TextField
                            name="label"
                            variant="outlined"
                            label="Label"
                            value={state.label}
                            onChange={(e) => updateProperty('label', e.target.value)}
                            helperText="Enter a label for the field."
                        />
                    </Grid>

                    <Grid item sm={6} xs={12} sx={{ mx: 1.5, my: 2 }}>
                        <TextField
                            name="helperText"
                            variant="outlined"
                            label="Helper Text"
                            fullWidth
                            multiline={true}
                            rows={4}
                            value={state.helperText}
                            helperText="Help text shown along with the field (like this text)."
                            onChange={(e) => updateProperty('helperText', e.target.value)}
                        />
                    </Grid>
                </Card>
            </Grid>

            {children}

            <Grid item xs={12}>
                <Card variant="outlined" sx={{ display: 'flex ' }}>
                    <Grid item sm={4} sx={{ mx: 1.5, my: 2 }}>
                        <FormControlLabel required
                            control={<Checkbox
                                checked={state.required}
                                onChange={(e) => updateProperty('required', e.target.checked)}
                            />} label="Required" />
                    </Grid>

                    <Grid item sm={4} sx={{ mx: 1.5, my: 2 }} container direction="column">
                        <FormControlLabel required
                            control={<Checkbox
                                checked={state.annotation}
                                onChange={(e) => updateProperty('annotation', e.target.checked)}
                            />} label="Enable Annotation" />

                        {state.annotation &&
                            <TextField
                                name="label"
                                variant="outlined"
                                label="Label"
                                value={state.annotationLabel}
                                onChange={(e) => updateProperty('annotationLabel', e.target.value)}
                                helperText="Enter a label."
                                sx={{ mt: 1.5 }}
                            />
                        }
                    </Grid>

                    <Grid item sm={4} sx={{ mx: 1.5, my: 2 }} container direction="column">
                        <FormControlLabel required
                            control={<Checkbox
                                checked={state.uncertainty}
                                onChange={(e) => updateProperty('uncertainty', e.target.checked)}
                            />} label="Enable Uncertainty" />

                        {state.uncertainty &&
                            <TextField
                                name="label"
                                variant="outlined"
                                label="Label"
                                value={state.uncertaintyLabel}
                                onChange={(e) => updateProperty('uncertaintyLabel', e.target.value)}
                                helperText="Enter a label."
                                sx={{ mt: 1.5 }}
                            />
                        }
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    )
};