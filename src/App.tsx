import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { NotebookEditor } from './components/notebook-editor'

function App() {

  const notebook = {
    metadata: {
      name: "Project Name",
      pre_description: "Project Description",
      project_lead: "Project Lead",
      lead_institution: "Lead Institution"
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
