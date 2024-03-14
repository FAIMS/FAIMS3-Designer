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

import { Grid, Select, FormControl, InputLabel, MenuItem, Stack, Divider, TextField, Button, IconButton, Tooltip } from "@mui/material";
import { useAppSelector } from "../state/hooks";
import { FieldType, Notebook } from "../state/initial";
import {useEffect, useMemo, useState} from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import _ from "lodash";

// Defines the Condition component to create a conditional expression
// that can be attached to a View or Field (and maybe more)

type ConditionType = {
    operator: string;
    field?: string;
    value?: unknown;
    conditions?: ConditionType[];
}

type ConditionProps = {
    onChange?: ((v: ConditionType | null) => void);
    initial?: ConditionType;
}

const EMPTY_FIELD_CONDITION = {operator: 'equal', field: '', value: ''};
const EMPTY_BOOLEAN_CONDITION = {operator: 'and', conditions: []}

export const ConditionControl = (props: ConditionProps) => {

    const initial = props.initial || EMPTY_FIELD_CONDITION;

    const [condition, setCondition] = useState(initial);

    const conditionChanged = (condition: ConditionType | null) => {
        if (condition === null) {
            setCondition(EMPTY_FIELD_CONDITION)
        } else {
           setCondition(condition);
        }
        if (props.onChange !== undefined) props.onChange(condition);
    }

    const isBoolean = condition.operator === 'and' || condition.operator === 'or';

    return (
        <Stack direction="row" spacing={2} sx={{border: '1px dashed grey', padding: '10px'}}>
            {isBoolean ?
                (<BooleanConditionControl onChange={conditionChanged} initial={condition} />)
                :
                (<FieldConditionControl onChange={conditionChanged} initial={condition} />)
            }
        </Stack>
    )

}

export const BooleanConditionControl = (props: ConditionProps) => {

    const initial: ConditionType = useMemo(() => props.initial || EMPTY_BOOLEAN_CONDITION, [props]);

    const [condition, setCondition] = useState<ConditionType|null>(initial);

    const updateOperator = (value: string) => {
        setCondition({...condition, operator: value})
    }

    const updateCondition = (index: number) => {
        return (value: ConditionType | null) => {
            if (condition && condition.conditions) {
                if (value === null) {
                    const newConditions = condition.conditions.filter((v: ConditionType, i: number) => {
                        return (i !== index)
                    })
                    if (newConditions.length === 0) 
                        setCondition(null);
                    else 
                        setCondition({...condition, conditions: newConditions})
                } else {
                    const newConditions = condition.conditions.map((v: ConditionType, i: number) => {
                        if (i === index) return value;
                        else return v;
                    })
                    setCondition({...condition, conditions: newConditions})
                }
            } else if (condition) {
                if (value) setCondition({...condition, conditions: [value]})
                else setCondition(null)
            }
        }
    }

    useEffect(() => {
        // call onChange if we have a full record and the condition is different t initialValue
        if (!_.isEqual(condition, initial)) {
            if (props.onChange) {
                props.onChange(condition);
            }
        }
    }, [props, initial, condition]);
        
    const addCondition = () => {
        if (props.onChange) {
            const existing = condition.conditions || [];
            // construct a condition with an new empty field condition
            const newCondition = {...condition, 
                    conditions: [
                        ...existing, 
                        EMPTY_FIELD_CONDITION
                    ]
                };
            setCondition(newCondition)
            props.onChange(newCondition)
        }
    };

    const deleteCondition = () => {
        if (props.onChange) {
            props.onChange(null);
        }
    }

    if (condition) 
        return (
            <Stack direction='row' spacing={2}>

                <Stack direction="column" spacing={2}>
                        {condition.conditions ? 
                            condition.conditions.map((cond: ConditionType, index: number) => 
                            (
                                <ConditionControl key={index} onChange={updateCondition(index)} initial={cond}/>
                            ))
                            : (<div></div>)
                        }
                <Tooltip describeChild title="Add another condition">
                    <Button variant="outlined" color='primary' onClick={addCondition}>
                        Add another condition
                    </Button>
                </Tooltip>
                </Stack>
                <Stack direction="column" spacing={2}>
                    <FormControl sx={{ minWidth: 100 }}>
                        <InputLabel id="operator">Operator</InputLabel>
                        <Select
                            labelId="operator"
                            label="Operator"
                            onChange={(e) => updateOperator(e.target.value)}
                            value={condition.operator}
                        >
                            <MenuItem key="and" value="and">
                                and
                            </MenuItem>
                            <MenuItem key="or" value="or">
                                or
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Tooltip describeChild title="Remove this boolean condition">
                        <IconButton color='secondary' onClick={deleteCondition}>
                            <RemoveCircleIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Stack>
        );
        else return (<div></div>)

}

const FieldConditionControl = (props: ConditionProps) => {
    
    const initialValue = useMemo(() => props.initial || {
        field: '',
        operator: '',
        value: ''
    }, [props]);
    const [condition, setCondition] = useState(initialValue);

    const allFields = useAppSelector((state: Notebook) => state['ui-specification'].fields);

    const allOperators = [
        ['equal', 'Equal to'],
        ['not-equal', 'Not equal to'],
        ['greater', 'Greater than'],
        ['greater-equal', 'Greater than or equal'],
        ['less', 'Less than'],
        ['less-equal', 'Less than or equal'],
        ['regex', 'Matches regular expression'],
    ];

    const updateField = (value: string) => {
        setCondition({...condition, field: value});
    }

    const updateOperator = (value: string) => {
        setCondition({...condition, operator: value});
    }

    const updateValue = (value: any) => {
        setCondition({...condition, value: value});
    }

    const getFieldLabel = (f: FieldType) => {
        return (f['component-parameters'].InputLabelProps && 
                f['component-parameters'].InputLabelProps.label) ||
                f['component-parameters'].name;
    };

    useEffect(() => {
        // call onChange if we have a full record and the condition is different ot initialValue
        if (!_.isEqual(condition, initialValue)) {
            if (props.onChange && condition.field && condition.operator && condition.value) {
                props.onChange(condition);
            }
        }
    }, [props, initialValue, condition])

    const addCondition = () => {
        if (props.onChange) {
           props.onChange({
                operator: 'and',
                conditions: [condition, EMPTY_FIELD_CONDITION]
            })
        }
    }

    const deleteCondition = () => {
        if (props.onChange) {
            props.onChange(null);
         }
    }

    return (
        <Grid container>
            <Stack 
              direction="row" 
              spacing={2} 
              divider={<Divider orientation="vertical" flexItem />}
              justifyContent="space-evenly"
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="field">Field</InputLabel>
                    <Select
                        labelId="field"
                        label="Field Name"
                        onChange={(e) => updateField(e.target.value)}
                        value={condition.field}
                    >
                        {Object.keys(allFields).map((fieldId) => {
                            return (
                                <MenuItem key={fieldId} value={fieldId}>
                                    {getFieldLabel(allFields[fieldId])}
                                </MenuItem>
                            );
                        })
                        }
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="operator">Operator</InputLabel>
                    <Select
                        labelId="operator"
                        label="Operator"
                        onChange={(e) => updateOperator(e.target.value)}
                        value={condition.operator}
                    >
                    {allOperators.map(([op, name]: string[]) => {
                            return (
                                <MenuItem key={op} value={op}>
                                    {name}
                                </MenuItem>
                            );
                        })
                    }
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                    <TextField 
                      variant="outlined"
                      label="Value"
                      value={condition.value}
                      onChange={(e) => updateValue(e.target.value)} />
                </FormControl>
                <Tooltip describeChild title="Make this an 'and' or 'or' condition">
                    <IconButton color='primary' onClick={addCondition}>
                        <SplitscreenIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip describeChild title="Remove this condition">
                    <IconButton color='secondary' onClick={deleteCondition}>
                        <RemoveCircleIcon/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Grid>
    )
}
