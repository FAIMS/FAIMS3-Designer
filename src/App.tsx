import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NotebookEditor } from './components/notebook-editor'

function App() {

  const notebook = {
    metadata: {
      "name": "Blue Mountains Survey",
      "access": {
          "accessFORM1": ["admin"],
          "accessFORM2": ["admin"],
          "accessFORM3": ["admin"]
      },
      "accesses":   ["admin", "moderator", "team"],
      "filenames": [],
      "forms": {
          "FORM1":
          {
              "submitActionFORM1": "Save and New",
              "annotationFORM1": true,
              "uncertaintyFORM1": false,
              "formaccessinheritFORM1": false,
              "visibleFORM1": true
          },
          "FORM2":
          {
              "submitActionFORM2": "Save and New",
              "annotationFORM2": true,
              "uncertaintyFORM2": false,
              "formaccessinheritFORM2": false,
              "visibleFORM2": true
          },
          "FORM3":
          {
              "submitActionFORM3": "Save and New",
              "annotationFORM3": true,
              "uncertaintyFORM3": false,
              "formaccessinheritFORM3": false,
              "visibleFORM3": true
          }
      },
      "ispublic": false,
      "isrequest": false,
      "lead_institution": "Macquarie University",
      "pre_description": "This notebook was created for the field survey of the Nellies Glen and Ruined Castle areas located in the Blue Mountains National Park as part of the Australian Research Council Linkage project History, heritage and environmental change in a deindustrialised landscape led by Associate Professor Tanya Evans, Macquarie University, Sydney, Australia, in partnership with the Blue Mountains World Heritage Institute, Lantern Heritage and Mountains Heritage. The project investigates a 19th-century shale-mining community in Jamison Valley through archaeological and archival research complemented by oral histories. The notebook has been designed for field survey of the historic mining heritage site in the Jamison Valley, near Katoomba.",
      "project_lead": "Penny Crook",
      "project_status": "New",
      "sections": {}
  },
    uiSpec: {}
  }


  return (
    <>
      <NotebookEditor notebook={notebook} />
    </>
  )
}

export default App
