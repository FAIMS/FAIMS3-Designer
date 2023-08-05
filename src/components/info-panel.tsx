import { Alert, Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface StringMap {[key: string]: string};

export const InfoPanel = ({initial, updateHandler}) => {

    const [metadata, setMetadata] = useState(initial);
    const [metadataFieldName, setMetadataFieldName] = useState('');
    const [metadataFieldValue, setMetadataFieldValue] = useState('');
    const [extraFields, setExtraFields] = useState<StringMap>({}); 
    const [alert, setAlert] = useState('');
    
    useEffect(() => {
        const knownFields = ['name', 'pre_description', 
                            'project_lead', 'lead_institution',
                            'access', 'accesses', 'forms', 'filenames',
                            'ispublic', 'isrequest', 'sections',
                        'project_status'];
        const unknownFields = Object.keys(metadata).filter((key) => !knownFields.includes(key));
        const newExtraFields = {};
        unknownFields.forEach((key) => {
            newExtraFields[key] = metadata[key];
        });
        setExtraFields(newExtraFields);
    }, [metadata]);

    const setProp = (prop: string, value: string) => {
        const newMetadata = Object.assign({}, metadata);
        newMetadata[prop] = value;
        updateHandler(newMetadata);
        setMetadata(newMetadata);
    };

    const updateMetadataFieldName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetadataFieldName(event.target.value);
    };

    const updateMetadataFieldValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetadataFieldValue(event.target.value);
    };

    const addNewMetadataField = () => { 
        setAlert('');
        console.log('new field', metadataFieldName, metadataFieldValue);
        if (metadataFieldName in metadata) {
            setAlert(`Field '${metadataFieldName}' already exists`);
        } else {
            setMetadataFieldName('');
            setMetadataFieldValue('');
            setProp(metadataFieldName, metadataFieldValue);
        }
    };

    return (
        <div>
            <h2>General Information</h2>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                required
                label="Project Name"
                helperText="Enter a string between 2 and 100 characters long"
                name="name"
                data-testid="name"
                value={metadata.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProp('name', event.target.value);
                }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="Project Lead"
                name="project_lead"
                value={metadata.project_lead}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProp('project_lead', event.target.value);
                }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                name="pre_description"
                fullWidth
                required
                label="Project Description"
                multiline={true}
                rows={4}
                value={metadata.pre_description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProp('pre_description', event.target.value);
                }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="Lead Institution"
                name="lead_institution"
                value={metadata.lead_institution}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProp('lead_institution', event.target.value);
                }}
            />
          </Grid>

          <Grid container item xs={12} spacing={2}>

            {Object.keys(extraFields).map((key) => {
                return (
                    <Grid item xs={12} key={key}>
                        <TextField
                            fullWidth
                            label={key}
                            name={key}
                            value={extraFields[key]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setProp(key, event.target.value);
                            }}
                        />
                    </Grid>
                );
            })}

            {alert && 
            <Grid item xs={12}>
                <Alert onClose={() => {setAlert('')}} severity="error">{alert}</Alert>
            </Grid>}
            
            <Grid item xs={5}>
            <TextField
                fullWidth
                label="Metadata Field Name"
                name="metadata_field_name"
                value={metadataFieldName}
                onChange={updateMetadataFieldName}
                />
            </Grid>
            <Grid item xs={5}>
            <TextField
                fullWidth
                label="Metadata Field Value"
                name="metadata_field_value"
                value={metadataFieldValue}
                onChange={updateMetadataFieldValue}
                />
            </Grid>
            <Grid item xs={2}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={addNewMetadataField}>+</Button>
            </Grid>
          </Grid>

          </Grid>

        </div>
    );
}