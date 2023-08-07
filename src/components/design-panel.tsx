import { Alert, Box, Tab, Tabs } from "@mui/material";
import { SectionEditor } from "./section-editor";
import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";

export const DesignPanel = ({uiSpec, updateHandler}) => {

    const [tabIndex, setTabIndex] = useState('0');

    const uiSpecUpdate = (newUiSpec: any) => {
        updateHandler(newUiSpec);
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

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    };

    const maxKeys = Object.keys(uiSpec.viewsets).length;

    return (
        <TabContext value={tabIndex}>
            <h2>Design</h2>

        <Alert severity="info">Define the user interface for your notebook here. 
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
            {Object.keys(uiSpec.viewsets).map((key: string, index: number) => {
                const viewSet = uiSpec.viewsets[key];
                return (
                    <Tab key={index} label={viewSet.label} value={index.toString()} />
                )})}
                <Tab key={maxKeys} 
                     label="+ New Section" value={maxKeys.toString()} />
            </Tabs>
        </Box>
        {
            // Each viewSet defines a Section which should be a Tab here
            
            Object.keys(uiSpec.viewsets).map((key: string, index: number) => {
                const viewSet = uiSpec.viewsets[key];
                const views = viewSet.views;
                return (
                    <TabPanel key={index} value={index.toString()}>                        
                        {views.map((view: any) => {
                            // Each fView defines a Page in the form
                            const fView = uiSpec.fviews[view];
                            return (<SectionEditor 
                                key={view}
                                viewSet={viewSet}
                                fView={fView}
                                fields={uiSpec.fields}
                                updateField={updateField}
                                />)
                        })}
                    </TabPanel>
                )
        })}
        <TabPanel key={maxKeys} value={maxKeys.toString()}>
            <h4>Adding a new section</h4>
        </TabPanel>
        </TabContext>
    )

};