import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import PeopleDetails from "./Detail";
import * as coursesClient from "../client";

interface PeopleTableProps {
  users?: any[];
  fetchUsers?: () => void;
}

export default function PeopleTable({ users: propUsers, fetchUsers: propFetchUsers }: PeopleTableProps = {}) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(propUsers ? false : true);
  const [error, setError] = useState("");
  const { cid } = useParams(); // Get the course ID from URL parameters

  // Function to fetch users for the current course
  const fetchUsers = async () => {
    // If users are provided as props, use them (Admin/Users view)
    if (propUsers) {
      setUsers(propUsers);
      return;
    }
    
    // Otherwise fetch course-specific users (Course view)
    try {
      setLoading(true);
      setError("");
      
      if (!cid) {
        setError("Course ID not found");
        setLoading(false);
        return;
      }
      
      // Use the findUsersForCourse function from course client
      const enrolledUsers = await coursesClient.findUsersForCourse(cid);
      setUsers(enrolledUsers);
    } catch (err) {
      console.error("Error fetching users for course:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or when props/course ID changes
  useEffect(() => {
    if (propUsers) {
      setUsers(propUsers);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [cid, propUsers]);

  // Show loading state
  if (loading) {
    return <div className="p-3">Loading course users...</div>;
  }

  // Show error state
  if (error) {
    return <div className="p-3 text-danger">{error}</div>;
  }

  return (
    <div id="wd-people-table">
      <PeopleDetails fetchUsers={propFetchUsers || fetchUsers} />
      {users.length === 0 ? (
        <div className="p-3">No users enrolled in this course.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Section</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Activity</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName}</span>{" "}
                    <span className="wd-last-name">{user.lastName}</span>
                  </Link>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}