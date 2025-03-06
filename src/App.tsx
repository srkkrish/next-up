import { useEffect, useState } from 'react'
import './App.css'

import checkList from "./assets/check-list.png"

function App() {
  const [todoData, setTodoData] = useState<any[]>([]); // ✅ Initialize as an empty array

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch('https://dummyjson.com/todos?limit=0');
        const data = await response.json();
        setTodoData(Array.isArray(data.todos) ? data.todos : []); // ✅ Ensure it's an array
      } catch (error) {
        console.log(error); // If there's an error, log the error message
      }
    }
    fetchTodo();
  }, [])

  // To delete the todo from list
  const deleteTodo = (item: any, index: any) => {
    fetch(`https://dummyjson.com/todos/${item.id}`, {
      method: 'DELETE',
    }).then(res => res.json()).then((data: any) => {
      console.log(data);
      alert('Todo deleted successfully!');
      setTodoData((prevData: any) => prevData.filter((_: any, i: any) => i !== index));
    });
  }

  const onCheckboxChange = (event: any, todo: any) => {
    /* updating completed status of todo with id */
    fetch(`https://dummyjson.com/todos/${todo.id}`, {
      method: 'PUT', /* or PATCH */
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: event.target.checked,
      })
    }).then(res => res.json()).then((data: any) => {
      console.log(data);
      alert('Todo status updated successfully!');
      setTodoData((prevData: any) =>
        prevData.map((item: any) =>
          item.id === todo.id ? { ...item, completed: data.completed } : item
        )
      );
    });
  }

  const completedTodo = () => {
    return (todoData ?? []).filter((todo) => todo.completed).length;
  };

  return (
    <>
      <div className='todo-app'>
        <div className='container-list'>
          <div className='header'>Todo App
            <img src={checkList} alt="ToDo List" width={40} height={40} />
          </div>

          <div className='content'>
            {todoData.length > 0 ? (
              <ul className='todo-list'>
                {todoData.map((todo: any, index: any) => (
                  <li key={todo.id} className='todo-item'>
                    <input type="checkbox" checked={todo?.completed ?? false} onChange={(event: any) => onCheckboxChange(event, todo)} />
                    <span className='todo-text'>{todo.todo}</span>
                    <span className='fa fa-trash' title='Delete todo' onClick={() => deleteTodo(todo, index)}></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='loading-todos'>Loading todos &#x1F5D2;</p>
            )}
          </div>

          <strong className='footer'>Total Todo's: {todoData.length} | Completed Todo's: {completedTodo()}</strong>
        </div>
      </div>
    </>
  )
}

export default App
