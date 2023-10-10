// Copyright 2023 FAIMS Project
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

import {Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";

import { FieldList } from "./field-list";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../state/hooks";
import { shallowEqual } from "react-redux";
import { Notebook } from '../state/initial';

type Props = {
    viewSetId: string,
    viewId: string
};

export const SectionEditor = ({ viewSetId, viewId }: Props) => {

    const fView = useAppSelector((state: Notebook) => state['ui-specification'].fviews[viewId]);
    // const metadata = useAppSelector((state: Notebook) => state.metadata);
    const dispatch = useAppDispatch();

    const [state, setState] = useState({
        inheritAccess: true,
        access: ['admin'],
        label: fView.label
    })

    const updateProperty = (prop: string, value: (boolean | string | string[])) => {
        const newState = { ...state, [prop]: value };
        setState(newState);
    };

    const updateSectionLabel = (label: string) => {
        dispatch({type: 'ui-specification/sectionNameUpdated', payload: {viewId, label}});
    }   

    console.log('SectionEditor', viewId);

    return (
        <>
            <Grid container spacing={2}>
                <Grid item sm={6} p={2}>
                    <TextField
                        fullWidth
                        required
                        label="Section Name"
                        helperText="Name for this section of the form."
                        name="label"
                        data-testid="label"
                        value={fView.label}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            updateSectionLabel(event.target.value);
                        }}
                    />
                </Grid>
            </Grid>


            <FieldList viewId={viewId} viewSetId={viewSetId}/>
        </>
    );
}