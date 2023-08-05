import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { MultipleTextFieldEditor } from "./Fields/MultipleTextField";
import { BaseFieldEditor } from "./Fields/BaseFieldEditor";
import { TakePhotoFieldEditor } from "./Fields/TakePhotoField";
import { SelectFieldEditor } from "./Fields/SelectField";


export const FieldEditor = ({fieldName, field, updateField}) => {

    const fieldComponent = field['component-name'];

    const getFieldLabel = () => {
        return field['component-parameters'].label || 
               field['component-parameters'].InputLabelProps.label || 
               field['component-parameters'].name;
    }

    return (
        <Accordion key={fieldName}>
            <AccordionSummary>{getFieldLabel()} : {fieldComponent}</AccordionSummary>
            <AccordionDetails>
                {(fieldComponent === 'MultipleTextField' && 
                    <MultipleTextFieldEditor
                        fieldName={fieldName} 
                        field={field} 
                        updateField={updateField}
                    />)
                ||
                (fieldComponent === 'TakePhoto' && <TakePhotoFieldEditor fieldName={fieldName} field={field} updateField={updateField}/>)
                ||
                (fieldComponent === 'Select' && <SelectFieldEditor fieldName={fieldName} field={field} updateField={updateField}/>)
                ||
                <BaseFieldEditor
                    fieldName={fieldName}
                    field={field}
                    updateField={updateField} 
                    children={undefined}  
                />
                }
            </AccordionDetails>
        </Accordion>
    )
}