import { Alert } from "@mui/material";
import { useState } from "react";
import { SectionEditor } from "./section-editor";


export const DesignPanel = ({initial, updateHandler}) => {

    const [uiSpec, setUiSpec] = useState(initial);

    const uiSpecUpdate = (uiSpec: any) => {
        setUiSpec(uiSpec);
        updateHandler(uiSpec);
    };

    // Callback passed to each field editor component to update the
    // field that is being edited
    const updateField = (fieldName: string, field: any) => {
        // find the field in the uiSpec.fields object
        // and update it
        const newFields = {...uiSpec.fields};
        newFields[fieldName] = field;
        const newUiSpec = {...uiSpec, fields: newFields};
        uiSpecUpdate(newUiSpec);
    };

    return (
        <>
        <h2>Design</h2>

        <Alert severity="info">Define the user interface for your notebook here. 
        </Alert>

        {
            // iterate over the keys of the uiSpec.viewsets object
            // and display the toString() of each viewset
            Object.keys(uiSpec.viewsets).map((key) => {
                const viewSet = uiSpec.viewsets[key];
                const views = viewSet.views;
                const fView = uiSpec.fviews[views[0]];
                return (
                    <SectionEditor 
                        key={key}
                        viewSet={viewSet}
                        fView={fView}
                        fields={uiSpec.fields}
                        updateField={updateField}
                        />
                )
        })}
        </>
    )

};