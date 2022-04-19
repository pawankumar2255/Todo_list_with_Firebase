import { useState, useEffect } from 'react';
import './App.css';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import db from "./firebase"

function App() {
  const [text, setText] = useState("")
  const [todos, setTodos] = useState([])
  const [update, toggleUpdate] = useState(false)
  const [contId, setContId] = useState(null)
  const [updateText, setUpdateText] = useState("")
  const userCollectionRef = collection(db, "todos")

  const updateScreen = async () => {
    const data = await getDocs(userCollectionRef)
    setTodos(data.docs.map(doc => {
      return { ...doc.data(), id: doc.id }
    }))
    console.log(todos)
  }
  const addConent = async () => {
    if (update) {
      const userDoc = doc(db, "todos", contId)
      await updateDoc(userDoc, { content: updateText })
      toggleUpdate(false)
    } else {
      await addDoc(userCollectionRef, { content: text })
      setText("")
    }
    updateScreen()
  }

  const deleteContent = async (id) => {
    const userDoc = doc(db, "todos", id)
    await deleteDoc(userDoc)
    updateScreen()
  }

  const updateContent = async (id, content) => {
    setUpdateText(content)
    toggleUpdate(true)
    setContId(id)
  }

  useEffect(() => {
    updateScreen()
  }, [])

  return (
    <div className="App">
      <div className='card'>
        <div className='heads'>
          <h1>Todo App</h1>
          <input className='inputTodo' value={text} onChange={(e) => setText(e.target.value)} type='text' />
          <button onClick={addConent}>Add</button>
        </div>
        <div className='todoCards'>
          <ul className='cards' style={{}}>
            {todos.map((todo) => <div className="cardItem" key={todo.id}>
              {update && todo.id == contId ? <div style={{}}>
                <input type="text" value={updateText} onChange={(e) => setUpdateText(e.target.value)} />
                <button onClick={() => addConent()} className="updatebtn btn">update</button>
              </div> : <div>{todo.content}</div>}

              {update ? "" :
                <div className='btnDouble'>
                  <button className='btn' onClick={() => deleteContent(todo.id)}>Delete</button>
                  <button className='btn' onClick={() => updateContent(todo.id, todo.content)}>Edit</button>
                </div>}

            </div>)

            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
