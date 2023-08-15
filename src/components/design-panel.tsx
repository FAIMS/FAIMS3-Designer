// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Alert, Box, Tab, Tabs } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { TabContext, TabPanel } from "@mui/lab";
import { useState } from "react";
import { useAppSelector } from "../state/hooks";
import { FormEditor } from "./form-editor";
import { shallowEqual } from "react-redux";

export const DesignPanel = () => {

    const viewSets = useAppSelector(state => state['ui-specification'].viewsets, shallowEqual);

    const [tabIndex, setTabIndex] = useState('0');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue.toString());
    };

    const maxKeys = Object.keys(viewSets).length;
    console.log('DesignPanel');

    return (
        <TabContext value={tabIndex}>
            
        <Alert severity="info">Define the user interface for your notebook here.  Add one
        or more forms to collect data from users.  Each form can have one or more sections.  
        Each section has one or more form fields.
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="basic tabs example">
            {Object.keys(viewSets).map((key: string, index: number) => {
                const viewSet = viewSets[key];
                return (
                    <Tab key={index} label={'Form:' + viewSet.label} value={index.toString()} />
                )})}
                <Tab key={maxKeys} icon={<AddIcon />}
                     value={maxKeys.toString()} />
            </Tabs>
        </Box>
        {
            // Each viewSet defines a Form which should be a Tab here
            
            Object.keys(viewSets).map((key: string, index: number) => {
                return (
                    <TabPanel key={index} value={index.toString()}>
                        <FormEditor viewSetId={key} />
                    </TabPanel>
                )
        })}
        <TabPanel key={maxKeys} value={maxKeys.toString()}>
            <h4>Adding a new section</h4>
        </TabPanel>
        </TabContext>
    )

};