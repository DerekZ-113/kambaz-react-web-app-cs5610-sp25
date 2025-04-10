import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./style.css";
import * as userClient from "./Account/client";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
    const [courses, setCourses] = useState<any[]>([]);
    const [enrolling, setEnrolling] = useState<boolean>(false);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    const findCoursesForUser = async () => {
        try {
            if (!currentUser) return;
            const courses = await userClient.findCoursesForUser(currentUser._id);
            setCourses(courses);
        } catch (error) {
            console.error(error);
        }
    };
    
    const updateEnrollment = async (courseId: string, enrolled: boolean) => {
        try {
            if (!currentUser) {
                console.error("User must be logged in to update enrollment");
                return;
            }
            
            if (enrolled) {
                await userClient.enrollIntoCourse(currentUser._id, courseId);
            } else {
                await userClient.unenrollFromCourse(currentUser._id, courseId);
            }
            
            // Refresh courses list after enrollment change
            if (enrolling) {
                await fetchCourses();
            } else {
                await findCoursesForUser();
            }
        } catch (error) {
            console.error("Enrollment update failed:", error);
            alert("Enrollment update failed. Please try again.");
        }
    };
      
    const fetchCourses = async () => {
        try {
            if (!currentUser) return;
            const allCourses = await courseClient.fetchAllCourses();
            // Filter out null or invalid courses
            const validAllCourses = allCourses.filter((c: any) => c && c._id);
            
            const enrolledCourses = await userClient.findCoursesForUser(currentUser._id);
            // Filter out null or invalid courses
            const validEnrolledCourses = enrolledCourses.filter((c: any) => c && c._id);
            
            const courses = validAllCourses.map((course: any) => {
                if (validEnrolledCourses.find((c: any) => c._id === course._id)) {
                    return { ...course, enrolled: true };
                } else {
                    return { ...course, enrolled: false };
                }
            });
            setCourses(courses);
        } catch (error) {
            console.error(error);
        }
    };
      
    useEffect(() => {
        if (!currentUser) return;
        
        if (enrolling) {
            fetchCourses();
        } else {
            findCoursesForUser();
        }
    }, [currentUser, enrolling]);
    
    const [course, setCourse] = useState<any>({
        name: "New Course", 
        number: "New Number",
        startDate: "2023-09-10", 
        endDate: "2023-12-15", 
        description: "New Description",
    });

    const addNewCourse = async () => {
        try {
            if (!currentUser) {
                console.error("User must be logged in to add a course");
                return;
            }
            
            const newCourse = await courseClient.createCourse(course);
            
            // Update courses based on current mode
            if (enrolling) {
                setCourses([...courses, { ...newCourse, enrolled: true }]); // Set to true since server automatically enrolls
            } else {
                // Only update if the current user is the creator
                setCourses([...courses, newCourse]);
            }
            
            // Reset the form
            setCourse({
                name: "New Course", 
                number: "New Number",
                startDate: "2023-09-10", 
                endDate: "2023-12-15", 
                description: "New Description",
            });
            
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course. Please try again.");
        }
    };
    
    const deleteCourse = async (courseId: string) => {
        try {
          if (!currentUser) {
            console.error("User must be logged in to delete a course");
            return;
          }
          
          // Update the local state only after successful deletion
          setCourses(courses.filter((course) => course._id !== courseId));
          
        } catch (error) {
          console.error("Error deleting course:", error);
        }
    };

    const updateCourse = async () => {
        try {
          if (!currentUser) {
            console.error("User must be logged in to update a course");
            return;
          }
          await courseClient.updateCourse(course);
          setCourses(
              courses.map((c) => {
                if (c._id === course._id) {
                    return { ...course, enrolled: c.enrolled };
                } else {
                    return c;
                }
              })
          );
        } catch (error) {
          console.error("Error updating course:", error);
        }
    };

    return (
        <Session>
            <div id="wd-kambaz">
                <KambazNavigation />
                <div className="wd-main-content-offset p-3">
                    <Routes>
                        <Route path="/" element={<Navigate to="Account" />} />
                        <Route path="/Account/*" element={<Account />} />
                        <Route path="/Dashboard" element={
                            <ProtectedRoute>
                                <Dashboard 
                                    courses={courses}
                                    course={course}
                                    setCourse={setCourse}
                                    addNewCourse={addNewCourse}
                                    deleteCourse={deleteCourse}
                                    updateCourse={updateCourse}
                                    enrolling={enrolling}
                                    setEnrolling={setEnrolling}
                                    updateEnrollment={updateEnrollment}
                                />
                            </ProtectedRoute>
                        } />
                        <Route path="/Courses/:cid/*" element={
                            <ProtectedRoute>
                                <Courses courses={courses} /> 
                            </ProtectedRoute>
                        } />
                        <Route path="/Calendar" element={<h1>Calendar</h1>} />
                        <Route path="/Inbox" element={<h1>Inbox</h1>} />
                    </Routes>
                </div>
            </div>
        </Session>
    );
}
