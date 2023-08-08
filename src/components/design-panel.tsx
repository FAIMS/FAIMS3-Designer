import { Alert, Box, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Tab, Tabs } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { SectionEditor } from "./section-editor";
import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";

export const DesignPanel = ({uiSpec, updateHandler}) => {

    const [tabIndex, setTabIndex] = useState('0');
    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        annotation: true,
        uncertainty: true
    })

    const updateProperty = (prop: string, value: any) => {
        const newState = {...state, [prop]: value};
        setState(newState); 
    };

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

        <Alert severity="info">Define the user interface for your notebook here.  Add one
        or more forms to collect data from users.  Each form can have one or more sections.  
        Each section has one or more form fields.
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
            {Object.keys(uiSpec.viewsets).map((key: string, index: number) => {
                const viewSet = uiSpec.viewsets[key];
                return (
                    <Tab key={index} label={'Form:' + viewSet.label} value={index.toString()} />
                )})}
                <Tab key={maxKeys} icon={<AddIcon />}
                     value={maxKeys.toString()} />
            </Tabs>
        </Box>
        {
            // Each viewSet defines a Form which should be a Tab here
            
            Object.keys(uiSpec.viewsets).map((key: string, index: number) => {
                const viewSet = uiSpec.viewsets[key];
                const views = viewSet.views;
                return (
                    <TabPanel key={index} value={index.toString()}>

                        <Grid container spacing={2}>

                        <Grid item xs={12}>
                        <Paper elevation={3}>

                            <Alert severity="info">Configure who can access this form.</Alert>

                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    <FormControlLabel required 
                                    control={<Checkbox 
                                                checked={state.inheritAccess}
                                                onChange={(e) => updateProperty('inheritAccess', e.target.checked)} 
                                                />} label="Inherit Access from Notebook" />
                                </Grid>

                                {!state.inheritAccess && 
                                (
                                    <Grid item sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Roles with access</InputLabel>
                                            <Select 
                                            name="access" 
                                            multiple
                                            label="Roles with access"
                                            value={state.access}
                                            onChange={(e) => updateProperty('access', e.target.value)}
                                            >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="team">Team</MenuItem>
                                        </Select>
                                        </FormControl>
                                    </Grid>
                                )
                                }
                            </Grid>

                            <Alert severity="info">Configure annotation and uncertainty options 
                                                for all fields in this form.</Alert>
                            <Grid container spacing={2}>

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
                        </Paper>
                        </Grid>

                        <Grid item xs={12}>
                        {views.map((view: any) => {
                            // Each fView defines a Page in the form
                            const fView = uiSpec.fviews[view];
                            return (<SectionEditor 
                                key={view}
                                fView={fView}
                                fields={uiSpec.fields}
                                updateField={updateField}
                                />)
                        })}
                        </Grid>
                        </Grid>
                    </TabPanel>
                )
        })}
        <TabPanel key={maxKeys} value={maxKeys.toString()}>
            <h4>Adding a new section</h4>
        </TabPanel>
        </TabContext>
    )

};