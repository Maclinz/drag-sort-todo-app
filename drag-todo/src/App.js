import styled from "styled-components";
import { myTodos } from "./data/todos";
import { useEffect, useRef, useState } from "react";
import List from "./Components/List";
import uuid from 'react-uuid'
import {DndContext} from '@dnd-kit/core'
import {SortableContext} from '@dnd-kit/sortable'
import { useThemeContext } from "./context/themeContext";
import { gsap } from "gsap";

const grid = <i className="fa-solid fa-table-columns"></i>
const list = <i className="fa-solid fa-list-check"></i>


function App() {
  const [todos, setTodos] = useState(myTodos)
  const [value, setValue] = useState('')
  const [toggleGrid, setToggleGrid] = useState(false)

  //theme
  const theme = useThemeContext()

  //refs
  const todosRef = useRef()
  const todosCon = useRef()
  const formRef = useRef()

  //local storage
  const saveToLocalStorage = (todos) => {
    if(todos){
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }

  //delete from local storage
  const removeItemFromLocalStorage = (id) => {
    const filtered = todos.filter((todo) => {
      return todo.id !== id
    })
    localStorage.setItem('todos', JSON.stringify(filtered))
  }

  //retrieve from local storage
  useEffect(() =>{
    const localTodos = localStorage.getItem('todos')
    if(localTodos){
      setTodos(JSON.parse(localTodos))
    }

    //grid from local storage
    const localGrid = localStorage.getItem('toggleGrid')
    if(localGrid){
      setToggleGrid(JSON.parse(localGrid))
    }
  }, [])

  const handleChange = (e) => {
    setValue(e.target.value)
    console.log(value)
  }
  

  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!value || value.length < 3){
      return alert('Todo must be at least 3 characters!')
    }

    const newTodos = [...todos, {
      id: uuid(),
      name: value,
      completed: false
    }]

    setTodos(newTodos)
    //send to local storage
    saveToLocalStorage(newTodos)
    //clear input
    setValue('')
  }

  //remove
  const removeTodo = (id) => {
    removeItemFromLocalStorage(id)
    const filtered = todos.filter((todo) => {
      return todo.id !== id
    })

    setTodos(filtered)
  }

  //handle grid
  const gridHandler = () => {
    setToggleGrid(!toggleGrid)
    localStorage.setItem('toggleGrid', JSON.stringify(!toggleGrid))
  }

  //handle completion
  const handleCompleted = (id) => {
    const newTodos = todos.map((todo) =>{
      if(todo.id === id){
        todo.completed = !todo.completed
      }

      return todo
    })

    setTodos(newTodos)
    saveToLocalStorage(newTodos)
  }

  const handleDragEnd = (event) => {
    const {active, over} = event

    if(active.id !== over.id){
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        //create new array with new order
        const newItems = [...items]
        //reomeove the item from old index
        newItems.splice(oldIndex, 1)
        //insert the item at a new index
        newItems.splice(newIndex, 0, items[oldIndex])

        //save to localStorage before returning the newItems
        saveToLocalStorage(newItems);

        return newItems
      })
    }
  }

  //animate
  useEffect(() => {
    const tl = gsap.timeline({defaults: {ease: 'power1.out', duration: 1}})
    tl.fromTo(todosRef.current,
      {opacity: 0, x: 800},
      {opacity: 1, x: 0, duration: 0.5})

      //todos Container animation
      .fromTo(todosCon.current,
        { opacity: 0, y: 800, scale: 0.5 },
        { opacity: 1, y: 0, duration: 0.5, scale:1,  }, '-=0.5')

      //form container animation
      .fromTo(formRef.current,
        { opacity: 0, y: -800, scaleX: 0 },
        { opacity: 1, y: 0, duration: 0.5, scaleX:1,  }, '-=0.1')

  }, [])

  return (
    <AppStyled grid={toggleGrid}  theme={theme}>
      <form action="" ref={formRef} className="form" onSubmit={handleSubmit}>
        <h1>Today's Tasks</h1>
        <div className="input-container">
          <input type="text" value={value} onChange={handleChange} placeholder="Add a Task" />
          <div className="submit-btn">
            <button>+ Add Todo</button>
          </div>
        </div>
      </form>

      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((todo) => todo.id)}>
          <ul className="todos-con" ref={todosCon}>
            <div className="priority-con">
              <p>
                Priority
              </p>
              <div className="toggle-grid">
                <button onClick={gridHandler}>
                  {
                    toggleGrid ? grid : list
                  }
                </button>
              </div>
              <p>
                High
              </p>
            </div>
            <div className="todos" ref={todosRef}>
              {
              todos.map((todo) =>{
                  const{id, name, completed} = todo
                  return <List 
                    key={id} 
                    name={name} 
                    id={id} 
                    grid={toggleGrid}
                    completed={completed} 
                    removeTodo={removeTodo}
                    handleCompleted={handleCompleted} 
                  />
                })
              }
            </div>
            <div className="low-priority">
              <p>
                Low
              </p>
            </div>
          </ul>
        </SortableContext>
      </DndContext>
    </AppStyled >
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  padding: 5rem 25rem;
  background-color: ${(props) => props.theme.colorBg3};
  overflow: hidden;
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
    background: ${(props) => props.theme.colorBg2};
    border-radius: 1rem;
    margin-bottom: 2rem;
    padding: 2rem 1rem;
    box-shadow: ${(props) => props.theme.shadow3};
    border: 1px solid ${props => props.theme.colorIcons3};
    h1{
      font-size: clamp(1.5rem, 2vw, 2.5rem);
      font-weight: 800;
      color: ${(props) => props.theme.colorPrimaryGreen};
    }
    .input-container{
      margin: 2rem 0;
      position: relative;
      font-size: clamp(1rem, 2vw, 1.2rem);
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      input, button{
        font-family: inherit;
        font-size: clamp(1rem, 2vw, 1.2rem);
      }
      input{
        background: transparent;
        border:1px solid ${(props) => props.theme.colorIcons3};
        border-radius: 7px;
        padding: .8rem 1rem;
        color: ${(props) => props.theme.colorGrey2};
        width: 100%;
        &:focus{
          outline: none;
        }
        &::placeholder{
          color: ${(props) => props.theme.colorGrey3};
        }
        &:active, &:focus{
          border: 1px solid ${(props) => props.theme.colorIcons};
        }
      }
      button{
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        border: none;
        background: ${(props) => props.theme.colorPrimaryGreen};
        height: 100%;
        padding: 0 1rem;
        border-top-right-radius: 7px;
        border-bottom-right-radius: 7px;
        color: ${(props) => props.theme.colorWhite};
        transition: all .3s ease;
        &:hover{
          background: ${(props) => props.theme.colorPrimary2};
        }
      }
    }
  }

  .todos-con{
    overflow: hidden;
    background: ${(props) => props.theme.colorBg2};
    padding: 5rem;
    border-radius: 1rem;
    box-shadow: ${(props) => props.theme.shadow3};
    border: 1px solid ${props => props.theme.colorIcons3};
    .todos{
      display: ${(props) => props.grid ? 'grid': ''};
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      grid-column-gap: 1rem;
      transition: all .3s ease;
      grid-row-gap: ${(props) => props.grid ? '0' : '1rem'};
    }
    .priority-con{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      p{
        font-size: clamp(1rem, 2vw, 1.2rem);
        font-weight: 600;
        color: ${(props) => props.theme.colorGrey2};
        &:last-child{
          color: ${(props) => props.theme.colorDanger};
        }
      }
    }
    .toggle-grid{
      button{
        padding: .5rem 1rem;
        border-radius: 7px;
        background: ${(props) => props.theme.buttonGradient11};
        border: 1px solid ${(props) => props.theme.colorIcons3};
        cursor: pointer;
        font-size: clamp(1rem, 2vw, 1.6rem);
        color: ${(props) => props.theme.colorGrey1};
        transition: all .3s ease;
      }
    }

    .low-priority{
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      p{
        font-size: clamp(1rem, 2vw, 1.2rem);
        font-weight: 600;
        background-clip: text;
        background: ${(props) => props.theme.colorPrimaryGreenGrad};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
`;

export default App;
