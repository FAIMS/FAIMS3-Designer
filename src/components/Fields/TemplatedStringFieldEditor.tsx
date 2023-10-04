import { Grid, Card, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { useRef } from "react";

type PropType = {
    fieldName: string,
    viewId: string
};

export const TemplatedStringFieldEditor = ({ fieldName, viewId }: PropType) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const allFields = useAppSelector(state => state['ui-specification'].fields);
    const dispatch = useAppDispatch();
    const textAreaRef = useRef(null);

    const state = field['component-parameters']

    const getFieldLabel = (f) => {
        return (f['component-parameters'] && f['component-parameters'].label) ||
            (f['component-parameters'].InputLabelProps && f['component-parameters'].InputLabelProps.label) ||
            f['component-parameters'].name;
    }

    const updateFieldFromState = (newState: newState) => {
        const newField = JSON.parse(JSON.stringify(field)); // deep copy
        newField['component-parameters'].label = newState.label;
        newField['component-parameters'].helperText = newState.helperText;
        newField['component-parameters'].template = newState.template;
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    };

    const updateProperty = (prop: string, value: any) => {
        const newState = { ...state, [prop]: value };
        updateFieldFromState(newState);
    };

    const insertFieldId = (fieldId: string) => {
        console.log('insertFieldId', fieldId);
        // insert {{fieldId}} at the cursor in the text area
        if (textAreaRef.current) {
            const el = textAreaRef.current as HTMLTextAreaElement;
            console.log('tar', el);
            el.focus();
            const [start, end] = [el.selectionStart, el.selectionEnd];
            el.setRangeText(`{{${fieldId}}}`, start, end, 'select'); 
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
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

                <Grid item xs={12}>
                    <p>The template can contain any text plus references to field or metadata
                        values in double curly braces (e.g. {"{{field-id}}"}).  Use the menu 
                        on the right to insert the identifiers of the fields in this notebook.
                    </p>
                    <Card variant="outlined" sx={{ display: 'flex' }}>
                        <Grid item sm={6} xs={12} sx={{ mx: 1.5, my: 2 }}>
                            <TextField
                                name="template"
                                inputRef={(ref) => textAreaRef.current = ref}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                label="Template"
                                value={state.template}
                                onChange={(e) => updateProperty('template', e.target.value)}
                                helperText="Enter the template."
                            />
                        </Grid>

                        <Grid item xs={4} sx={{ mx: 1.5, my: 2 }}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="featureType-label">Insert Field Identifier</InputLabel>
                                <Select
                                    labelId="featureType-label"
                                    label="Insert Field Identifier"
                                    onChange={(e) => insertFieldId(e.target.value)}
                                >
                                    {Object.keys(allFields).map((fieldId) => {
                                        return (
                                            <MenuItem key={fieldId} value={fieldId}>
                                                {getFieldLabel(allFields[fieldId])}
                                            </MenuItem>
                                        );
                                    })
                                    }
                                </Select>
                            </FormControl>
                    </Grid>
                    </Card>
                </Grid>


            </Grid>

        </Grid>
    )
};