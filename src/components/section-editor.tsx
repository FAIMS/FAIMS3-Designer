import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { FieldEditor } from "./field-editor";

export const SectionEditor = ({fView, viewSet, fields, updateField}) => {

    // return the details for this field name
    const getField = (fieldName: string) => {
        return fields[fieldName];
    };

    return (<Accordion>
        <AccordionSummary><h3>Section: {viewSet.label}</h3></AccordionSummary>
        <AccordionDetails>
            {fView.fields.map((fieldName : string) => {
                const field = getField(fieldName);
                return (
                        <FieldEditor 
                            key={fieldName} 
                            fieldName={fieldName} 
                            field={field}
                            updateField={updateField}
                         />
                        )
            })}
        </AccordionDetails>
    </Accordion>);
}