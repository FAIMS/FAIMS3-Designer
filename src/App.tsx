import './App.css'
import { NotebookEditor } from './components/notebook-editor';
import sample_notebook from '../notebooks/sample_notebook.json';

function App() {

  return (
    <>
      <NotebookEditor notebook={sample_notebook} />
    </>
  )
}

export default App
