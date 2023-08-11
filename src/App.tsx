import './App.css';
import { NotebookEditor } from './components/notebook-editor';
import sample_notebook from '../notebooks/FAIMS3-Beta-Demo-Notebook.json';
//import sample_notebook from '../notebooks/sample_notebook.json'
import { store } from './state/store';
import { Provider } from 'react-redux';

function App() {

  return (
    <Provider store={store}>
      <NotebookEditor notebook={sample_notebook} />
    </Provider>
  )
}

export default App
