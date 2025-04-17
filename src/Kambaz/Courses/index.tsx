import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { Navigate, Route, Routes, useParams } from "react-router";
import PeopleTable from "./People/Table";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/QuizEditor";
import QuizTaking from "./Quizzes/QuizTaking";
import QuizResults from "./Quizzes/QuizTaking/QuizResults";
import QuizPreview from "./Quizzes/QuizPreview";
// Add this import
import NewQuiz from './NewQuiz';
import QuizDetails from "./Quizzes/QuizDetails";

export default function Courses({ courses = [], currentUser }: { courses: any[]; currentUser: any }) {
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
                        
                        {/* Add these quiz routes */}
                        <Route path="Quizzes" element={<Quizzes currentUser={currentUser} />} />
                        <Route path="Quizzes/new" element={<NewQuiz currentUser={currentUser} />} />
                        <Route path="Quizzes/:quizId/edit" element={<QuizEditor currentUser={currentUser} />} />
                        <Route path="Quizzes/:quizId/take" element={<QuizTaking currentUser={currentUser} />} />
                        <Route path="Quizzes/:quizId/results/:attemptId" element={<QuizResults currentUser={currentUser} />} />
                        <Route path="Quizzes/:quizId/preview" element={<QuizPreview currentUser={currentUser} />} />
                        <Route path="Quizzes/:quizId/details" element={<QuizDetails currentUser={currentUser} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}