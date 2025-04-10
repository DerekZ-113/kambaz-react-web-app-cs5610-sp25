import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { Navigate, Route, Routes, useParams } from "react-router";
import PeopleTable from "./People/Table";


export default function Courses({ courses = [] }: { courses: any[]; }) {
    const { cid } = useParams();
    
    // Filter out null/undefined courses first
    const validCourses = courses.filter(course => course && course._id);
    
    // Then find the matching course
    const course = validCourses.find((course) => course._id === cid);
    
    // Handle case where no course is found
    if (!course) {
        return <div className="alert alert-warning">Course not found. Please select a course from your dashboard.</div>;
    }
    
    return (
        <div id="wd-courses">
            <h2 className="text-danger">
                {course.name}
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