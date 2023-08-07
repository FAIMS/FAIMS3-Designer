import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { FieldEditor } from "./field-editor";
import { useState } from "react";

export const FieldList = ({fView, fields, updateField}) => {

    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = () => {
        setDialogOpen(true);
    }

    const closeDialog = () => {
        setDialogOpen(false);
    }

    // return the details for this field name
    const getField = (fieldName: string) => {
        return fields[fieldName];
    };

    return (
        <>
         {fView.fields.map((fieldName : string) => {
                const field = getField(fieldName);
                if (field) 
                    return (
                            <FieldEditor 
                                key={fieldName}
                                fieldName={fieldName} 
                                field={field}
                                updateField={updateField}
                            />
                            )
                else
                    return (<p>Unknown field {fieldName}</p>)
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