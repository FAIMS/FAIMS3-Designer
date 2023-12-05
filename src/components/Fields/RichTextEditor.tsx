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

import { Grid, FormHelperText, Alert, Card } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../state/hooks";
import { useRef, Suspense, useState } from "react";

import '@mdxeditor/editor/style.css'

// importing the editor and the plugin from their full paths
import { MDXEditor } from '@mdxeditor/editor/MDXEditor';
import { MDXEditorMethods, MdastImportVisitor, Separator, realmPlugin, system } from '@mdxeditor/editor';
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar';
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings';
import { listsPlugin } from '@mdxeditor/editor/plugins/lists';
import { quotePlugin } from '@mdxeditor/editor/plugins/quote';
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break';
import { markdownShortcutPlugin } from '@mdxeditor/editor/plugins/markdown-shortcut';
import { tablePlugin } from '@mdxeditor/editor/plugins/table';
import { diffSourcePlugin } from '@mdxeditor/editor/plugins/diff-source';
import { linkPlugin } from '@mdxeditor/editor/plugins/link';

// importing the desired toolbar toggle components
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo';
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles';
import { BlockTypeSelect } from '@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect';
import { ListsToggle } from '@mdxeditor/editor/plugins/toolbar/components/ListsToggle';
import { InsertTable } from '@mdxeditor/editor/plugins/toolbar/components/InsertTable';
import { DiffSourceToggleWrapper } from '@mdxeditor/editor/plugins/toolbar/components/DiffSourceToggleWrapper';

import { FieldType, Notebook } from "../../state/initial";


export const RichTextEditor = ({ fieldName }: { fieldName: string }) => {

    const field = useAppSelector((state: Notebook) => state['ui-specification'].fields[fieldName]);
    const dispatch = useAppDispatch();

    const initContent = field['component-parameters'].content || "";

    const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage('');
    };

    /*
        The following is taken from and inspired by: 
        https://github.com/mdx-editor/editor/issues/202#issuecomment-1827182167 & 
        https://github.com/mdx-editor/editor/issues/95#issuecomment-1755320066 
    */
    const catchAllVisitor: MdastImportVisitor<any> = {
        testNode: () => true,
        visitNode: ({ mdastNode, actions }) => {
            // deviating from the example shown in the second link,
            // for now, I'm simply showing an error message
            setErrorMessage(`Sorry, we currently do not support the markdown ${mdastNode?.type} option. 
                What you have just written was automatically removed. Please continue carefully.`);
        }
    };

    const [catchAllPlugin] = realmPlugin({
        id: "catchAll",
        systemSpec: system(() => ({})),
        init: (realm) => {
            realm.pubKey("addImportVisitor", catchAllVisitor);
        }
    });

    return (
        <Grid container xs={12} sm={8} sx={{ m: 'auto' }}>
            <Grid item xs={12}>
                <Suspense fallback={<div>Loading...</div>}>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <Card variant="outlined">
                        <MDXEditor
                            markdown={initContent}
                            plugins={[
                                headingsPlugin(),
                                listsPlugin(),
                                quotePlugin(),
                                thematicBreakPlugin(),
                                markdownShortcutPlugin(),
                                tablePlugin(),
                                diffSourcePlugin({ diffMarkdown: initContent }),
                                linkPlugin(),
                                toolbarPlugin({
                                    toolbarContents: () => (
                                        <DiffSourceToggleWrapper>
                                            <UndoRedo />
                                            <Separator />
                                            <BoldItalicUnderlineToggles />
                                            <Separator />
                                            <BlockTypeSelect />
                                            <Separator />
                                            <ListsToggle />
                                            <Separator />
                                            <InsertTable />
                                        </DiffSourceToggleWrapper>
                                    )
                                }),
                                catchAllPlugin(),
                            ]}
                            ref={ref}
                            onChange={() => updateProperty('content', ref.current?.getMarkdown())}
                            contentEditableClassName="mdxEditor"
                        />
                    </Card>
                </Suspense>
                <FormHelperText>Use this editor to add rich text to your notebook.</FormHelperText>
            </Grid>
        </Grid>
    )
};