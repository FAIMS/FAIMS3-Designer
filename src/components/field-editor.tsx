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

import { Accordion, AccordionDetails, Stack, 
         Typography, IconButton, Tooltip } from "@mui/material";
import MuiAccordionSummary, {
    AccordionSummaryProps,
  } from '@mui/material/AccordionSummary';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';

import { MultipleTextFieldEditor } from "./Fields/MultipleTextField";
import { BaseFieldEditor } from "./Fields/BaseFieldEditor";
import { TakePhotoFieldEditor } from "./Fields/TakePhotoField";
import { TextFieldEditor } from "./Fields/TextFieldEditor";
import { DateTimeNowEditor } from "./Fields/DateTimeNowEditor";
import { OptionsEditor } from "./Fields/OptionsEditor";
import { MapFormFieldEditor } from "./Fields/MapFormFieldEditor";
import { RandomStyleEditor } from "./Fields/RandomStyleEditor";
import { RichTextEditor } from "./Fields/RichTextEditor";
import { RelatedRecordEditor } from "./Fields/RelatedRecordEditor";
import { BasicAutoIncrementerEditor } from "./Fields/BasicAutoIncrementer";
import { TemplatedStringFieldEditor } from "./Fields/TemplatedStringFieldEditor";
import { AdvancedSelectEditor } from "./Fields/AdvancedSelectEditor";

import { Notebook } from "../state/initial";
import { useAppDispatch, useAppSelector } from "../state/hooks";

import { styled } from '@mui/material/styles';

// customise the accordion summary a little 
const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1),
    },
  }));


type FieldEditorProps = {
    fieldName: string,
    viewSetId?: string,
    viewId: string,
    expanded: boolean,
    handleExpandChange: (event: React.SyntheticEvent, newState: boolean) => void
};

export const FieldEditor = ({ fieldName, viewId, expanded, handleExpandChange }: FieldEditorProps) => {

    const field = useAppSelector((state: Notebook) => state['ui-specification'].fields[fieldName]); 
    const dispatch = useAppDispatch();

    const fieldComponent = field['component-name'];

    const getFieldLabel = () => {
        return (field['component-parameters'] && field['component-parameters'].label) || 
               (field['component-parameters'].InputLabelProps && field['component-parameters'].InputLabelProps.label) || 
               field['component-parameters'].name;
    }

    const moveFieldDown = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        dispatch({type: 'ui-specification/fieldMoved', payload: {fieldName, viewId, direction: 'down'}});
    }

    const moveFieldUp = (event: React.SyntheticEvent) => {
        event.stopPropagation(); 
        dispatch({type: 'ui-specification/fieldMoved', payload: {fieldName, viewId, direction: 'up'}});
    }

    const deleteField = (event: React.SyntheticEvent) => {
        event.stopPropagation(); 
        dispatch({type: 'ui-specification/fieldDeleted', payload: {fieldName, viewId}});
    }

    return (
        <Accordion key={fieldName} expanded={expanded} onChange={handleExpandChange}>
            <AccordionSummary>
                <Typography>{getFieldLabel()} : {fieldComponent}</Typography>

                <Stack direction='row' style={{width: '100%'}} justifyContent='right'>
                    <Tooltip title="Delete Field">
                        <IconButton onClick={deleteField} aria-label='delete' size='small'>
                            <DeleteIcon />
                        </IconButton>        
                    </Tooltip>
                    <Tooltip title='Move up'>
                        <IconButton onClick={moveFieldUp} aria-label='up' size='small'>
                            <ArrowDropUpIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='Move down'>
                        <IconButton onClick={moveFieldDown} aria-label='down' size='small'>
                            <ArrowDropDownIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                {(fieldComponent === 'MultipleTextField' && 
                    <MultipleTextFieldEditor
                        fieldName={fieldName}  
                    />)
                ||
                (fieldComponent === 'TakePhoto' && <TakePhotoFieldEditor fieldName={fieldName}  />)
                ||
                (fieldComponent === 'TextField' && <TextFieldEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'DateTimeNow' && <DateTimeNowEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'Select' && <OptionsEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'MultiSelect' && <OptionsEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'AdvancedSelect' && <AdvancedSelectEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'RadioGroup' && <OptionsEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'MapFormField' && <MapFormFieldEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'RandomStyle' && <RandomStyleEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'RichText' && <RichTextEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'RelatedRecordSelector' && <RelatedRecordEditor fieldName={fieldName} />)
                ||
                (fieldComponent === 'BasicAutoIncrementer' && 
                    <BasicAutoIncrementerEditor 
                        fieldName={fieldName}
                        viewId={viewId}
                        />)
                ||
                (fieldComponent === 'TemplatedStringField' &&
                    <TemplatedStringFieldEditor fieldName={fieldName} viewId={viewId}/>
                )
                || 
                <BaseFieldEditor
                    fieldName={fieldName} 
                />
                }
            </AccordionDetails>
        </Accordion>
    )
}