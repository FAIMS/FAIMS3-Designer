/*
    Code here is a mixture from 
    (1) https://github.com/mahmedyoutube/lexical-editor-tutorial/blob/master/src/components/LexicalEditorTopBar/useOnClickListener.jsx
    (2) https://github.com/facebook/lexical/blob/main/packages/lexical-playground/src/plugins/ToolbarPlugin/index.tsx

    (1) was used because this developer offered an example of how to use Lexical using MUI.
    (2) was used because the Lexical dev team has updated their way of doing things slightly AND uses TypeScript, 
    which helped with removing type errors.
*/

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    // CAN_REDO_COMMAND,
    // CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    // $getNodeByKey,
    // ElementNode,
    // RangeSelection,
    // TextNode,
    DEPRECATED_$isGridSelection,
    COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { useCallback } from "react";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from "@lexical/list";
import {
    $isHeadingNode,
    $createHeadingNode,
    HeadingTagType,
} from "@lexical/rich-text";
//import { $isLinkNode } from "@lexical/link";
import {
    $isParentElementRTL,
    // $isAtNodeEnd,
    $setBlocksType,
} from "@lexical/selection";
import { eventTypes } from "./iconsList";


const useOnClickListener = () => {
    const [editor] = useLexicalComposerContext();
    const [blockType, setBlockType] = useState("paragraph");
    const [selectedElementKey, setSelectedElementKey] = useState(null);
    const [isRTL, setIsRTL] = useState(false);
    //const [isLink, setIsLink] = useState(false);

    const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        let allSelectedEvents: string[] = [...selectedEventTypes];

        // inner function
        const pushInEventTypesState = (selectionFormat: boolean, event: string) => {
            if (selectionFormat) {
                if (selectedEventTypes.includes(event)) return;
                else allSelectedEvents.push(event);
            } else {
                allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
            }
        };

        // range selection (e.g., like to bold only the particular area of the text)
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();

            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();

                    setBlockType(type);
                }
            }

            pushInEventTypesState(selection.hasFormat("bold"), eventTypes.formatBold);
            pushInEventTypesState(
                selection.hasFormat("italic"),
                eventTypes.formatItalic
            );
            pushInEventTypesState(
                selection.hasFormat("underline"),
                eventTypes.formatUnderline
            );

            setIsRTL($isParentElementRTL(selection));

            // NOTE: This code has to do with links, I believe. Commented out for now.
            // const node = getSelectedNode(selection);
            // const parent = node.getParent();
            // if ($isLinkNode(parent) || $isLinkNode(node)) {
            //     if (!allSelectedEvents.includes(eventTypes.formatInsertLink))
            //         allSelectedEvents.push(eventTypes.formatInsertLink);
            //     setIsLink(true);
            // } else {
            //     if (allSelectedEvents.includes(eventTypes.formatInsertLink)) {
            //         allSelectedEvents = allSelectedEvents.filter(
            //             (ev) => ev !== eventTypes.formatCode
            //         );
            //     }
            //     setIsLink(false);
            // }

            setSelectedEventTypes(allSelectedEvents);
        }
    }, [editor]);


    // As far as I understand, this controls what button a user has selected in the toolbar.
    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, newEditor) => {
                    updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            )
        );
    }, [editor, updateToolbar]);


    // This simply tells Lexical what to do when clicking on a specified formatting button. 
    // Formatting text as a paragraph, h1, h2, h3, bullet or numbered list does not have
    // an out-of-the-box command like the other formatting options do. 
    // This is why formatting a paragraph, heading or list is defined below (code taken from Lexical Playground Github).
    const onClick = (eventType: string) => {
        if (eventType === eventTypes.formatUndo) {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
        } else if (eventType === eventTypes.formatRedo) {
            editor.dispatchCommand(REDO_COMMAND, undefined);
        } else if (eventType === eventTypes.formatBold) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        } else if (eventType === eventTypes.formatItalic) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        } else if (eventType === eventTypes.formatUnderline) {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        } else if (eventType === eventTypes.formatAlignLeft) {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        } else if (eventType === eventTypes.formatAlignRight) {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        } else if (eventType === eventTypes.formatAlignCenter) {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        } else if (eventType === eventTypes.paragraph) {
            formatParagraph();
        } else if (eventType === eventTypes.h1) {
            formatHeading('h1');
        } else if (eventType === eventTypes.h2) {
            formatHeading('h2');
        } else if (eventType === eventTypes.h3) {
            formatHeading('h3');
        } else if (eventType === eventTypes.ul) {
            formatBulletList();
        } else if (eventType === eventTypes.ol) {
            formatNumberedList();
        }
    };

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (
                $isRangeSelection(selection) ||
                DEPRECATED_$isGridSelection(selection)
            ) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const formatHeading = (headingSize: HeadingTagType) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = $getSelection();
                if (
                    $isRangeSelection(selection) ||
                    DEPRECATED_$isGridSelection(selection)
                ) {
                    $setBlocksType(selection, () => $createHeadingNode(headingSize));
                }
            });
        }
    };

    const formatBulletList = () => {
        if (blockType !== "ul") {
            console.log("dispatch command ");
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    const formatNumberedList = () => {
        if (blockType !== "ol") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        }
    };

    return { onClick, selectedEventTypes, blockType, editor };
};

// NOTE: Seems like this code has to do with getting a Link format to work. Commented out for now. Can maybe extend later.
// function getSelectedNode(
//     selection: RangeSelection,
// ): TextNode | ElementNode {
//     const anchor = selection.anchor;
//     const focus = selection.focus;
//     const anchorNode = selection.anchor.getNode();
//     const focusNode = selection.focus.getNode();
//     if (anchorNode === focusNode) {
//         return anchorNode;
//     }
//     const isBackward = selection.isBackward();
//     if (isBackward) {
//         return $isAtNodeEnd(focus) ? anchorNode : focusNode;
//     } else {
//         return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
//     }
// }

export default useOnClickListener;