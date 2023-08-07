import { Grid, TextField } from "@mui/material";
import { useState } from "react";
import { BaseFieldEditor } from "./BaseFieldEditor"

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

export const SelectFieldEditor = ({fieldName, field, updateField}) => {

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
        console.log(optionArray);
        field['component-parameters'].ElementProps.options =
            optionArray.map(o => {return {label: o, value: o}})
        updateField(field);
    }

    return (
        <BaseFieldEditor
            fieldName={fieldName} 
            field={field} 
            updateField={updateField}>

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