import axios from "axios";

export const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/api/users`;

// Create an axios instance with defaults
const axiosWithCredentials = axios.create({ 
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for logging or modifying requests
axiosWithCredentials.interceptors.request.use(
  (config) => {
    // You could add additional headers here if needed
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for handling common error cases
axiosWithCredentials.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized - You need to sign in");
          // Could dispatch a logout action here or redirect to login
          break;
        case 403:
          console.log("Forbidden - You don't have permission");
          break;
        case 500:
          console.log("Server error - Please try again later");
          break;
      }
    } else if (error.request) {
      console.log("Network error - Server not responding");
    }
    return Promise.reject(error);
  }
);

export const signin = async (credentials: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
};

export const signup = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
  } catch (error) {
    console.error("Sign up failed:", error);
    throw error;
  }
};
  
export const updateUser = async (user: any) => {
  try {
    const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
    return response.data;
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
};
  
export const profile = async () => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
  } catch (error) {
    console.error("Profile fetch failed:", error);
    throw error;
  }
};

export const findMyCourses = async () => {
  try {
    const { data } = await axiosWithCredentials.get(`${USERS_API}/current/courses`);
    return data;
  } catch (error) {
    console.error("Course fetch failed:", error);
    throw error;
  }
};
  
export const signout = async () => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
    return response.data;
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

export const createCourse = async (course: any) => {
  try {
    const { data } = await axiosWithCredentials.post(`${USERS_API}/current/courses`, course);
    return data;
  } catch (error) {
    console.error("Create course failed:", error);
    throw error;
  }
};

export const findAllUsers = async () => {
  try {
    const response = await axiosWithCredentials.get(USERS_API);
    return response.data;
  } catch (error) {
    console.error("Fetch all users failed:", error);
    throw error;
  }
};

export const findUsersByRole = async (role: string) => {
  const response = await
    axios.get(`${USERS_API}?role=${role}`);
  return response.data;
};

export const findUsersByPartialName = async (name: string) => {
  const response = await axios.get(`${USERS_API}?name=${name}`);
  return response.data;
};

export const findUserById = async (id: string) => {
  const response = await axios.get(`${USERS_API}/${id}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete( `${USERS_API}/${userId}` );
  return response.data;
};

export const createUser = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(USERS_API, user);
    return response.data;
  } catch (error) {
    console.error("Create user failed:", error);
    throw error;
  }
};

export const findCoursesForUser = async (userId: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${userId}/courses`);
  return response.data;
};

export const enrollIntoCourse = async (userId: string, courseId: string) => {
  try {
    const response = await axiosWithCredentials.post(
      `${USERS_API}/${userId}/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Course enrollment failed:", error);
    throw error;
  }
};

export const unenrollFromCourse = async (userId: string, courseId: string) => {
  try {
    const response = await axiosWithCredentials.delete(
      `${USERS_API}/${userId}/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Course unenrollment failed:", error);
    throw error;
  }
};


