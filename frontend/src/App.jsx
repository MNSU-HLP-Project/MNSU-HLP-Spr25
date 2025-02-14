import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EntryForm from './EntryForm'

function App() {
  const [count, setCount] = useState(0)

  return (
      <EntryForm>
      </EntryForm>

  )
}

export default App
