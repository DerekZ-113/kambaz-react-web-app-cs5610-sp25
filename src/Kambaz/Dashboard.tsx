import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as db from "./Database";

export default function Dashboard() {
    const courses = db.courses;
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
            <div id="wd-dashboard-courses">
            <Row xs={1} md={5} className="g-4">
                {courses.map((course) => (
                <Col className="wd-dashboard-course" style={{ width: "300px" }}>
                    <Card>
                    <Link to={`/Kambaz/Courses/${course._id}/Home`}
                            className="wd-dashboard-course-link text-decoration-none text-dark" >
                        <Card.Img src="/images/reactjs.jpg" variant="top" width="100%" height={160} />
                        <Card.Body className="card-body">
                        <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                            {course.name} </Card.Title>
                        <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                            {course.description} </Card.Text>
                        <Button variant="primary"> Go </Button>
                        </Card.Body>
                    </Link>
                    </Card>
                </Col>
                ))}
            </Row>
            </div>
        </div>
    );
}

//         <div id="wd-dashboard">
//             <h1 id="wd-dashboard">Dashboard</h1> <hr />
//             <h2 id="wd-dashboard-published">Published Courses(8)</h2> <hr />
//             <div className="wd-dashboard-courses">

//                 <Row xs={1} md={5} className="g-4">
//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1234 React JS</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Full Stack software developer</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/data_structure.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1235 Data Structure</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Intro to data structures</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/algorithm.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1236 Algorithm</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Introduce the advanced computer science algorithms</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/artificial_intelligence.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1237 Artificial Intelligence</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Introduction to Aritifical Intelligence </Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/ios_development.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1238 iOS Development</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Using Swift to develope a iOS based software</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/machine_learning.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1239 Machine Learning</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Introducing the theory for machine learning and the application</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/front_end_development.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1240 Front-End Development</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Introduce the front end development and create a project</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>

//                     <Col className="wd-dashboard-course" style={{ width: 300 }}>
//                         <Card>
//                             <Link to="/Kambaz/Courses/1234/Home"
//                                     className="wd-dashboard-course-link text-decoration-none text-dark">
//                                 <Card.Img variant="top" src="/images/cloud_service.jpeg" width="100%" height={160}/>
//                                 <Card.Body>
//                                 <Card.Title className="wd-dashboard-course-title">CS1241 Cloud Service</Card.Title>
//                                 <Card.Text  className="wd-dashboard-course-description">Intrudcing the cloud service and usage</Card.Text>
//                                 <Button variant="primary">Go</Button>
//                                 </Card.Body>
//                             </Link>
//                         </Card>
//                     </Col>
                    
//                 </Row>
//             </div>
//         </div>
//     );
// }