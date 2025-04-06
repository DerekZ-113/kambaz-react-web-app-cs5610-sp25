import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const API_BASE = `${REMOTE_SERVER}/api`;

// Fetch all enrollments
export const fetchAllEnrollments = async () => {
  const { data } = await axios.get(`${API_BASE}/enrollments`);
  return data;
};

// Fetch enrollments for a specific user
export const fetchUserEnrollments = async (userId: string) => {
  const { data } = await axios.get(`${API_BASE}/users/${userId}/enrollments`);
  return data;
};

// Fetch users enrolled in a course
export const fetchCourseEnrollments = async (courseId: string) => {
  const { data } = await axios.get(`${API_BASE}/courses/${courseId}/enrollments`);
  return data;
};

// Check if a user is enrolled in a course
export const checkEnrollment = async (userId: string, courseId: string) => {
  const { data } = await axios.get(`${API_BASE}/users/${userId}/courses/${courseId}/enrollment`);
  return data.enrolled;
};

// Enroll a user in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(`${API_BASE}/users/${userId}/enrollments/${courseId}`);
  return data;
};

// Unenroll a user from a course
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.delete(`${API_BASE}/users/${userId}/enrollments/${courseId}`);
  return data;
};