import { Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";


const sample =  {
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
        "SelectProps":{},
        "InputLabelProps": { "label": "Feature Description" },
        "FormHelperTextProps": {},
        "id": "newfieldc25e8929",
        "name": "newfieldc25e8929"
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
};

const couldBe =  {
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
    "access":["admin"],
    "annotation": true, /* EDIT */
    "uncertainty":false, /* EDIT */
};

export const MultipleTextFieldEditor = ({fieldName}) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const cParams = field['component-parameters'];

    const state = {
        label: cParams.InputLabelProps.label || fieldName,
        helperText: cParams.helperText || "",
        required: cParams.required || false,
        rows: cParams.InputProps.rows || 4,
        annotation: field.meta.annotation || false,
        uncertainty: field.meta.uncertainty.include || false
    };

    const updateFieldFromState = (newState) => {
        const newField = {...field};
        newField['component-parameters'].InputLabelProps.label = newState.label;
        newField['component-parameters'].helperText = newState.helperText;
        newField['component-parameters'].required = newState.required;
        newField['component-parameters'].InputProps.rows = newState.rows;
        newField.meta.annotation = newState.annotation;
        newField.meta.uncertainty = newState.uncertainty;
        updateField(fieldName, newField);
    };

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        updateFieldFromState(newState);
    };

    const updateField = (fieldName: string, newField: any) => {
        console.log('updateField', fieldName, newField);
    }

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
                        fullWidth
                        multiline={true}
                        rows={4}
                        value={state.helperText} 
                        helperText="Help text shown along with the field (like this text)."
                        onChange={(e) => updateProperty('helperText', e.target.value)} 
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField 
                        name="rows" 
                        variant="outlined"
                        label="Rows to display"
                        type="number"
                        value={state.rows} 
                        helperText="Number of rows in the text field."
                        onChange={(e) => updateProperty('rows', e.target.value)} 
                    />
                </Grid>

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