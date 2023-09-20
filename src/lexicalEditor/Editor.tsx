import lexicalEditorTheme from "./lexicalEditorTheme.tsx";
import { LexicalToolBar } from "./plugins/toolBar/LexicalToolBar.tsx"
import "./styles.css";

import { $getRoot, $getSelection, EditorState } from "lexical";
import { useEffect, useState } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
//import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
//import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS,
} from '@lexical/markdown';


export const Editor = ({ content }: any) => {

    const initialEditorState: string = content;
    console.log('in editor ', initialEditorState)

    const [newContent, setNewContent] = useState('')

    const editorConfig = {
        namespace: "MyEditor",
        theme: lexicalEditorTheme,

        //editorState: initialEditorState,

        onError(error: any) {
            console.error(error);
        },

        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode
        ]
    };

    //console.log('in config ', editorConfig.editorState)

    const onChange = (editorState: EditorState) => {
        editorState.read(() => {
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            console.log('md ', markdown);
            setNewContent(markdown);

        });
    }

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <LexicalToolBar />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Enter some rich text...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={onChange} />
                    <HistoryPlugin />
                    <ListPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                </div>
            </div>
        </LexicalComposer>
    );
}