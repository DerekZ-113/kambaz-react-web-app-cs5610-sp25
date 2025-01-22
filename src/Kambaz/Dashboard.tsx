import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses(8)</h2> <hr />
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
                        <img src="/images/data_structure.jpeg" width={200} />
                        <div>
                            <h5> CS1235 Data Structure</h5>
                            <p className="wd-dashboard-course-title">
                                Intro to data structures
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/algorithm.jpeg" width={200} />
                        <div>
                            <h5> CS1236 Algorithm</h5>
                            <p className="wd-dashboard-course-title">
                                Introduce the advanced computer science algorithms
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/artificial_intelligence.jpeg" width={200} />
                        <div>
                            <h5> CS1237 Artificial Intelligence</h5>
                            <p className="wd-dashboard-course-title">
                                Introduction to Aritifical Intelligence 
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/ios_development.jpeg" width={200} />
                        <div>
                            <h5> CS1238 iOS Development</h5>
                            <p className="wd-dashboard-course-title">
                                Using Swift to develope a iOS based software
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/machine_learning.jpeg" width={200} />
                        <div>
                            <h5> CS1239 Machine Learning</h5>
                            <p className="wd-dashboard-course-title">
                                Introducing the theory for machine learning and the application
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/front_end_development.jpeg" width={200} />
                        <div>
                            <h5> CS1240 Front-End Development</h5>
                            <p className="wd-dashboard-course-title">
                                Introduce the front end development and create a project
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>

                <div className="wd-dashboard-course">
                    <Link to="/Kambaz/Courses/1234/Home" className="wd-dashboard-course-link" >
                        <img src="/images/cloud_service.jpeg" width={200} />
                        <div>
                            <h5> CS1241 Cloud Service</h5>
                            <p className="wd-dashboard-course-title">
                                Intrudcing the cloud service and usage
                            </p>
                            <button> Go </button>
                        </div>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}