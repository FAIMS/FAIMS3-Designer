import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { FieldEditor } from "./field-editor";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { shallowEqual } from "react-redux"; 

export const FieldList = ({fView}) => {

    const fields = useAppSelector(state => {
        Object.keys(state['ui-specification'].fields)}, shallowEqual);
    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
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
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={closeDialog}>Cancel</Button>
                <Button onClick={closeDialog}>Subscribe</Button>
                </DialogActions>
            </Dialog>
            </>
    )
}