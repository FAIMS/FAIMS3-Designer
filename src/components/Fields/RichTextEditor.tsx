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

import { Grid, Alert } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { useRef } from "react";

import '@mdxeditor/editor/style.css'

// importing the editor and the plugin from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import { MDXEditorMethods } from '@mdxeditor/editor';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';

// importing the toolbar and desired toggle components
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo';
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles';
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect';
import { ListsToggle } from '@mdxeditor/editor/plugins/toolbar/components/ListsToggle';
import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable';
import { Separator } from '@mdxeditor/editor';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import { FieldType, Notebook } from "../../state/initial";


export const RichTextEditor = ({ fieldName }: {fieldName: string}) => {

    const field = useAppSelector((state: Notebook) => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const initContent = field['component-parameters'].content || "";
    const ref = useRef<MDXEditorMethods>(null);

    const updateField = (fieldName: string, newField: FieldType) => {
        dispatch({ type: 'ui-specification/fieldUpdated', payload: { fieldName, newField } })
    }

    const state = {
        content: field['component-parameters'].content || "",
    };

    type newState = {
        content: string,
    }

    const updateFieldFromState = (newState: newState) => {
        const newField = JSON.parse(JSON.stringify(field)) as FieldType; // deep copy
        newField['component-parameters'].content = newState.content;
        updateField(fieldName, newField);
    };

    const updateProperty = (prop: string, value: string | undefined) => {
        const newState = { ...state, [prop]: value };
        updateFieldFromState(newState);
    };

    return (
        <Grid container sx={{ width: '45em', m: 'auto' }}>
            <Grid item sm={12} xs={12} sx={{ m: 2 }}>
                <Alert severity="info" sx={{ mb: 1 }}>Use this editor for rich text.</Alert>
                <MDXEditor
                    markdown={initContent}
                    plugins={[
                        headingsPlugin(),
                        listsPlugin(),
                        quotePlugin(),
                        thematicBreakPlugin(),
                        markdownShortcutPlugin(),
                        tablePlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <>
                                    <UndoRedo />
                                    <Separator />
                                    <BoldItalicUnderlineToggles />
                                    <Separator />
                                    <BlockTypeSelect />
                                    <Separator />
                                    <ListsToggle />
                                    <Separator />
                                    <InsertTable />
                                </>
                            )
                        }),

                    ]}
                    ref={ref}
                    onChange={() => updateProperty('content', ref.current?.getMarkdown())}
                    contentEditableClassName="mdxEditor"
                />
            </Grid>
        </Grid>
    )

};