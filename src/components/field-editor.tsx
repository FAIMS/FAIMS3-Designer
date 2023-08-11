import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { MultipleTextFieldEditor } from "./Fields/MultipleTextField";
import { BaseFieldEditor } from "./Fields/BaseFieldEditor";
import { TakePhotoFieldEditor } from "./Fields/TakePhotoField";
import { SelectFieldEditor } from "./Fields/SelectField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppSelector } from "../state/hooks";

export const FieldEditor = ({fieldName}) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]); 

    const fieldComponent = field['component-name'];

    const getFieldLabel = () => {
        return (field['component-parameters'] && field['component-parameters'].label) || 
               (field['component-parameters'].InputLabelProps && field['component-parameters'].InputLabelProps.label) || 
               field['component-parameters'].name;
    }

    return (
        <Accordion key={fieldName}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{getFieldLabel()} : {fieldComponent}</AccordionSummary>
            <AccordionDetails>
                {(fieldComponent === 'MultipleTextField' && 
                    <MultipleTextFieldEditor
                        fieldName={fieldName}  
                    />)
                ||
                (fieldComponent === 'TakePhoto' && <TakePhotoFieldEditor fieldName={fieldName}  />)
                ||
                (fieldComponent === 'Select' && <SelectFieldEditor fieldName={fieldName} />)
                ||
                <BaseFieldEditor
                    fieldName={fieldName} 
                    children={undefined}  
                />
                }
            </AccordionDetails>
        </Accordion>
    )
}