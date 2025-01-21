import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses(12)</h2> <hr />
            <div className="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/reactjs.jpg" width={200} />
                        <div>
                            <h5> CS1234 React JG</h5>
                            <p className="wd-dashboard-course-title">
                                Full Stack software developer
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}