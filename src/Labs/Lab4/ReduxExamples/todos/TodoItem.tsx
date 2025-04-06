import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroup, Button } from "react-bootstrap";

export default function TodoItem({ todo }: {
    todo: { id: string; title: string };
  }) {
    const dispatch = useDispatch();
    return (
        <ListGroup.Item>
          <Button onClick={() => dispatch(deleteTodo(todo.id))}
                  id="wd-delete-todo-click"> Delete </Button>
          <Button onClick={() => dispatch(setTodo(todo))}
                  id="wd-set-todo-click" className="ms-2"> Edit </Button>
          <span className="ms-3">{todo.title}</span>
        </ListGroup.Item>
    );}
