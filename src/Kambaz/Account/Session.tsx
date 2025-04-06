import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useAppDispatch } from "../hooks";
import { fetchEnrollments, clearEnrollments } from "../Courses/Enrollments/reducer";
import { useLocation } from "react-router-dom";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useAppDispatch();
  const [currentUser, setCurrentUserState] = useState(null);
  const location = useLocation();
  
  // Check if we're on a public path that doesn't need authentication
  const isPublicPath = () => {
    return location.pathname.includes("/Account/Signin") || 
           location.pathname.includes("/Account/Signup");
  };

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
      setCurrentUserState(currentUser);
    } catch (err: any) {
      // If error is 401 unauthorized, clear the current user
      if (err.response && err.response.status === 401) {
        dispatch(setCurrentUser(null));
        setCurrentUserState(null);
      } else {
        console.error("Error fetching user profile:", err);
      }
    } finally {
      // Always set pending to false, whether successful or not
      setPending(false);
    }
  };

  useEffect(() => {
    // If we're on a public path, don't try to fetch the profile
    if (isPublicPath()) {
      setPending(false);
      return;
    }
    
    fetchProfile();
  }, [location.pathname]);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (currentUser) {
        try {
          dispatch(clearEnrollments());
          await dispatch(fetchEnrollments());
        } catch (error) {
          console.error("Failed to fetch enrollments:", error);
        }
      }
    };
    
    if (currentUser) {
      loadEnrollments();
    }
  }, [currentUser, dispatch]);

  // Only show loading state if we're not on a public path
  if (pending && !isPublicPath()) {
    return <div>Loading...</div>;
  }
  
  return children;
}
