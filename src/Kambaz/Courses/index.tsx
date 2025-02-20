import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { Navigate, Route, Routes, useParams } from "react-router";
import PeopleTable from "./People/Table";
import { courses } from "../Database";


export default function Courses() {
    const { cid } = useParams();
    const course = courses.find((course) => course._id === cid);
    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                {course && course.name}
            </h2>
            <div className="d-flex wd-main-content-offset">
                <div className="flex-fill">
                    <CourseNavigation />
                    <Routes>
                    <Route path="/" element={<Navigate to="Home" />} />
                    <Route path="Home" element={<Home />} />
                    <Route path="Modules" element={<Modules />} />
                    <Route path="Assignments" element={<Assignments />} />
                    <Route path="Assignments/:aid" element={<AssignmentEditor />} />
                    <Route path="People" element={<PeopleTable />} />
                    </Routes>
            </div></div>
        </div>
    );
}