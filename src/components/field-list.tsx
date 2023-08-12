import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, MenuItem, Select } from "@mui/material";
import { FieldEditor } from "./field-editor";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { getFieldNames } from "../fields";



export const FieldList = ({viewId}) => {

    const fView = useAppSelector(state => state['ui-specification'].fviews[viewId]);
    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogState, setDialogState] = useState({
        name: 'New Text Field',
        type: 'TextField'
    });

    const allFieldNames = getFieldNames();

    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    const addField = () => {
        console.log('addField', dialogState);
        dispatch({
            type: 'ui-specification/fieldAdded',
            payload: {
                fieldName: dialogState.name,
                fieldType: dialogState.type,
                viewId: viewId
            }
        });
        setDialogOpen(false);
    }

    console.log('FieldList')

    return (
        <>
         {fView.fields.map((fieldName : string) => {
                return (
                        <FieldEditor 
                            key={fieldName}
                            fieldName={fieldName}  
                        />
                        )
            })}
            <Button variant="outlined" onClick={openDialog}>Add a Field</Button>

            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>New Field</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a new field in your form.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Field Name"
                        value={dialogState.name}
                        fullWidth
                        variant="standard"
                        onChange={(e) => {
                            setDialogState({
                                ...dialogState,
                                name: e.target.value
                            })
                        }}
                    />
                    <Select 
                        name="type" 
                        label="Field Type" 
                        fullWidth
                        value={dialogState.type}
                        onChange={(e) => {
                            setDialogState({
                                ...dialogState,
                                type: e.target.value
                            })
                        }}>
                        {allFieldNames.map((fieldName : string) => {
                            return (
                                <MenuItem key={fieldName} value={fieldName}>
                                    {fieldName}
                                </MenuItem>
                            )
                            })
                        }
                    </Select>
                </DialogContent>
                <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={addField}>Add Field</Button>
                </DialogActions>
            </Dialog>
            </>
    )
}