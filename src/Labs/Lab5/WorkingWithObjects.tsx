import { useState } from "react";
import { FormControl, Form } from "react-bootstrap";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });
  
  const [module, setModule] = useState({
    id: "CS5610",
    name: "Web Development",
    description: "Building dynamic web applications",
    course: "CS Master's Program"
  });
  
  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;
  
  return (
    <div>
      <h3 id="wd-working-with-objects">Working With Objects</h3>
      
      <h4>Assignment</h4>
      <h5>Modifying Properties</h5>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end mb-2"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title
      </a>
      <FormControl className="w-75 mb-3" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      
      <div className="mb-3">
        <a id="wd-update-assignment-score"
           className="btn btn-success float-end"
           href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
          Update Score
        </a>
        <FormControl className="w-75" id="wd-assignment-score" type="number"
          defaultValue={assignment.score} onChange={(e) =>
            setAssignment({ ...assignment, score: parseInt(e.target.value) })}/>
      </div>
      
      <div className="mb-3">
        <a id="wd-update-assignment-completed"
           className="btn btn-warning float-end"
           href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
          Update Completed
        </a>
        <Form.Check id="wd-assignment-completed" type="checkbox" label="Completed"
          defaultChecked={assignment.completed} onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })}/>
      </div>
      
      <h5>Retrieving Objects</h5>
      <a id="wd-retrieve-assignments" className="btn btn-primary me-2"
         href={`${ASSIGNMENT_API_URL}`}>
        Get Assignment
      </a>
      
      <h5>Retrieving Properties</h5>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${ASSIGNMENT_API_URL}/title`}>
        Get Title
      </a>
      
      <hr/>
      
      <h4>Module</h4>
      <h5>Modifying Properties</h5>
      <div className="mb-3">
        <a id="wd-update-module-name"
           className="btn btn-primary float-end"
           href={`${MODULE_API_URL}/name/${module.name}`}>
          Update Name
        </a>
        <FormControl className="w-75" id="wd-module-name"
          defaultValue={module.name} onChange={(e) =>
            setModule({ ...module, name: e.target.value })}/>
      </div>
      
      <div className="mb-3">
        <a id="wd-update-module-description"
           className="btn btn-info float-end"
           href={`${MODULE_API_URL}/description/${module.description}`}>
          Update Description
        </a>
        <FormControl className="w-75" id="wd-module-description"
          defaultValue={module.description} onChange={(e) =>
            setModule({ ...module, description: e.target.value })}/>
      </div>
      
      <h5>Retrieving Objects</h5>
      <a id="wd-retrieve-module" className="btn btn-primary me-2"
         href={`${MODULE_API_URL}`}>
        Get Module
      </a>
      
      <h5>Retrieving Properties</h5>
      <a id="wd-retrieve-module-name" className="btn btn-primary"
         href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a>
      
      <hr/>
    </div>
  );
}
