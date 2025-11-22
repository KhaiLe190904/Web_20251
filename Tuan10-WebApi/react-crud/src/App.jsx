import { useState } from 'react'
import './App.css'
import SearchForm from './components/SearchForm'
import AddUser from './components/AddUser'
import ResultTable from './components/ResultTable'

function App() {
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <div className="app-container">
      <h1>WEB API</h1>
      
      <div className="controls">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
      </div>

      <ResultTable
        keyword={kw}
        user={newUser}
        onAdded={() => setNewUser(null)}
      />
    </div>
  )
}

export default App
