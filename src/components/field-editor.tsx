import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { MultipleTextFieldEditor } from "./Fields/MultipleTextField";


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
                <pre>{JSON.stringify(field, null, 2)}</pre>}
            </AccordionDetails>
        </Accordion>
    )
}