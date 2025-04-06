import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { ListGroup, Button, FormControl } from "react-bootstrap";

export default function TodoForm() {
    const {todo} = useSelector((state: any) => state.todosReducer);
    const dispatch = useDispatch();
    
    const handleAdd = () => {
      if (todo.title.trim()) {
        dispatch(addTodo({...todo}));
      }
    };

    return (
    <ListGroup.Item>
        <Button onClick={handleAdd}
                id="wd-add-todo-click"> Add </Button>
        <Button onClick={() => dispatch(updateTodo(todo))}
                id="wd-update-todo-click" className="ms-2"> Update </Button>
        <FormControl 
          value={todo.title || ""}
          onChange={(e) => 
            dispatch(setTodo({ 
              ...todo, 
              id: todo.id || "-1", 
              title: e.target.value 
            }))}
          className="mt-2" />
    </ListGroup.Item>
    );
}
