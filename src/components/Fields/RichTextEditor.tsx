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

import { Grid, Alert, TextField, Card, } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { Editor } from "../../lexicalEditor/Editor.tsx";

export const RichTextEditor = ({ fieldName }: any) => {

    const field = useAppSelector(state => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const initContent: string = field['component-parameters'].content
    console.log('init ', initContent)

    const updateField = (fieldName: string, newField: any) => {
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const state = {
        content: field['component-parameters'].content || "",
    };

    type newState = {
        content: string,
    }

    const updateFieldFromState = (newState: newState) => {
        const newField = JSON.parse(JSON.stringify(field)); // deep copy
        newField['component-parameters'].content = newState.content;
        updateField(fieldName, newField);
    };

    const updateProperty = (prop: string, value: string) => {
        const newState = { ...state, [prop]: value };
        updateFieldFromState(newState);
    };

    return (
        <Grid item xs={12}>
            <Card variant="outlined" sx={{ display: 'flex' }}>
                <Grid item sm={12} xs={12} sx={{ mx: 1.5, my: 2 }}>
                    <Alert severity="info">Use this editor for rich text.</Alert>
                    <Editor content={initContent}/>
                </Grid>
            </Card>
        </Grid>
    )

};