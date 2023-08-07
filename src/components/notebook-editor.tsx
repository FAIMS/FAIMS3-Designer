import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Grid, Tab } from "@mui/material"
import { useState } from "react";
import { InfoPanel } from "./info-panel";
import { RolesPanel } from "./roles-panel";
import { DesignPanel } from "./design-panel";

export interface NotebookType {
    [key: string]: unknown;
}

export const NotebookEditor = ({notebook}: {notebook: NotebookType}) => {

    const [tabNumber, setTabNumber] = useState(1);
    const [metadata, setMetadata] = useState(notebook.metadata);
    const [uiSpec, setUiSpec] = useState(notebook['ui-specification']);

    const maxTabs = 5;

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabNumber(newValue.toString());
    };

    const nextTab = () => {
        tabNumber < maxTabs ? setTabNumber(tabNumber + 1) : setTabNumber(maxTabs);
    };

    const previousTab = () => {
        tabNumber > 1 ? setTabNumber((tabNumber - 1)) : setTabNumber(1);
    };

    const metadataUpdate = (metadata: any) => {
        setMetadata(metadata);
    };

    const uiSpecUpdate = (uiSpec: any) => {
        setUiSpec(uiSpec);
    };

    return (
        <div>
            <h1>Notebook Editor</h1>

            <TabContext value={tabNumber.toString()}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Info" value="1" />
                    <Tab label="Roles" value="2" />
                    <Tab label="Design" value="3" />
                    <Tab label="Behaviour" value="4" />
                    <Tab label="Submit" value="5" />
                    </TabList>
                </Box>
 
                <TabPanel value="1"><InfoPanel initial={metadata} updateHandler={metadataUpdate}/></TabPanel>
                <TabPanel value="2"><RolesPanel initial={metadata} updateHandler={metadataUpdate}/></TabPanel>
                <TabPanel value="3"><DesignPanel uiSpec={uiSpec} updateHandler={uiSpecUpdate} /></TabPanel>
                <TabPanel value="4">Behaviour</TabPanel>
                <TabPanel value="5">Submit</TabPanel>

                <Grid 
                    container 
                    spacing={2}
                    justifyContent="space-between"
                >
                    <Grid item>
                        {tabNumber > 1 ?
                        <Button variant="contained" color="primary" onClick={previousTab} >&lt; Previous</Button>
                        : <div>&nbsp;</div>
                        }
                        </Grid>
                        <Grid item>
                        {tabNumber < maxTabs ?
                            <Button variant="contained" color="primary" onClick={nextTab} >Next &gt;</Button>
                        : <div>&nbsp;</div>
                        }
                    </Grid>

                    <Grid item>
                        <pre className="code">
                            {JSON.stringify(uiSpec, null, 2)}
                        </pre> 
                    </Grid>
                </Grid>
      
            </TabContext>

        </div>
    );
};