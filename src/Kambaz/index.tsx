import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./style.css";
import * as userClient from "./Account/client";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ProtectedRoute from "./Account/ProtectedRoute";
import Session from "./Account/Session";
import { useSelector } from "react-redux";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
    const [courses, setCourses] = useState<any[]>([]);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    
    const fetchCourses = async () => {
        try {
          // Only fetch courses if there's a logged-in user
          if (currentUser) {
            const courses = await userClient.findMyCourses();
            setCourses(courses);
          } else {
            // Reset courses when not logged in
            setCourses([]);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      
      useEffect(() => {
        fetchCourses();
      }, [currentUser]);
    
    const [course, setCourse] = useState<any>({
        _id: "1234", name: "New Course", number: "New Number",
        startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
        });

        const addNewCourse = async () => {
            try {
                if (!currentUser) {
                    console.error("User must be logged in to add a course");
                    return;
                }
                
                // Send request to create course
                const newCourse = await userClient.createCourse(course);
                console.log("New course created:", newCourse); // Debug log
                
                // Reset the form to provide visual feedback
                setCourse({
                    _id: uuidv4(), // Generate a new ID
                    name: "New Course", 
                    number: "New Number",
                    startDate: "2023-09-10", 
                    endDate: "2023-12-15", 
                    description: "New Description",
                });
                
                // Show success message and inform user about refresh
                alert("Course added successfully! The page will refresh to show your new course.");
                
                // Force a page reload after a short delay to show the alert
                setTimeout(() => {
                    window.location.reload();
                }, 5);
                
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
                      return course;
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
            <Route path="/Dashboard" element={<ProtectedRoute><Dashboard courses={courses}
                        course={course}
                        setCourse={setCourse}
                        addNewCourse={addNewCourse}
                        deleteCourse={deleteCourse}
                        updateCourse={updateCourse}
            /></ProtectedRoute>} />
            <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses} /> </ProtectedRoute>} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
        </Routes>
        </div>
    </div>
    </Session>
);}
