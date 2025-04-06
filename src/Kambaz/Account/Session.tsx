import * as client from "./client";
import { useEffect, useState } from "react";
import { setCurrentUser } from "./reducer";
import { useAppDispatch } from "../hooks"; // Import the typed hook
import { fetchEnrollments, clearEnrollments } from "../Courses/Enrollments/reducer";

export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const [currentUser, setCurrentUserState] = useState(null);

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
      setCurrentUserState(currentUser);
    } catch (err: any) {
      console.error(err);
    }
    setPending(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const loadEnrollments = async () => {
      if (currentUser) {
        try {
          // Clear existing enrollments first
          dispatch(clearEnrollments());
          // Then fetch new ones - now this is properly typed
          await dispatch(fetchEnrollments());
        } catch (error) {
          console.error("Failed to fetch enrollments:", error);
        }
      }
    };
    
    loadEnrollments();
  }, [currentUser, dispatch]);

  if (pending) {
    return <div>Loading...</div>; // Or a spinner component
  }
  return children;
}
