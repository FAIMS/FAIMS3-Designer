import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { useState } from "react";

export const BaseFieldEditor = ({fieldName, field, updateField, children}) => {

    // These are needed because there is no consistency in how
    // the field label is stored in the notebook
    const getFieldLabel = () => {
        return field['component-parameters'].label || 
               field['component-parameters'].InputLabelProps.label || 
               field['component-parameters'].name;
    }

    const setFieldLabel = (label: string) => {
        if (field['component-parameters'].label)
            field['component-parameters'].label = label;
        if (field['component-parameters'].InputLabelProps && field['component-parameters'].InputLabelProps.label)
            field['component-parameters'].InputLabelProps.label = label;
        if (field['component-parameters'].name)
            field['component-parameters'].name = label;
    }

    const cParams = field['component-parameters'];

    const [state, setState] = useState({
        label: getFieldLabel(),
        helperText: cParams.helperText || "",
        required: cParams.required || false, 
        annotation: field.meta.annotation || false,
        uncertainty: field.meta.uncertainty.include || false
    });

    const updateFieldFromState = (newState) => {
        const newField = {...field};
        setFieldLabel(newState.label);
        newField['component-parameters'].helperText = newState.helperText;
        newField['component-parameters'].required = newState.required;
        newField.meta.annotation = newState.annotation;
        newField.meta.uncertainty = newState.uncertainty;
        updateField(fieldName, newField);
    };

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        setState(newState);
        updateFieldFromState(newState);
    };

    return ( 
            <Grid container spacing={2}>
                <Grid item sm={6} xs={12}>
                    <TextField 
                        name="label" 
                        variant="outlined"
                        label="Label"
                        value={state.label} 
                        onChange={(e) => updateProperty('label', e.target.value)} 
                        helperText="Enter a label for the field"
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField 
                        name="helperText" 
                        variant="outlined"
                        label="Helper Text"
                        multiline
                        value={state.helperText} 
                        helperText="Help text shown along with the field (like this text)."
                        onChange={(e) => updateProperty('helperText', e.target.value)} 
                    />
                </Grid>

                {children}

                <Grid item sm={6}>
                    <FormControlLabel required 
                                control={<Checkbox 
                                checked={state.required}
                                onChange={(e) => updateProperty('required', e.target.checked)} 
                              />} label="Required" />
                </Grid>

                <Grid item sm={6}>
                    <FormControlLabel required 
                    control={<Checkbox 
                                checked={state.annotation}
                                onChange={(e) => updateProperty('annotation', e.target.checked)} 
                              />} label="Enable Annotation" />
                </Grid>

                <Grid item sm={6}>
                    <FormControlLabel required 
                    control={<Checkbox 
                                checked={state.uncertainty}
                                onChange={(e) => updateProperty('uncertainty', e.target.checked)} 
                              />} label="Enable Uncertainty" />
                </Grid>
            </Grid> 
    )

};