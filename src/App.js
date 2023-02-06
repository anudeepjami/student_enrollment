import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar, Form, Button, Card, Container, Table, InputGroup } from 'react-bootstrap';
import Select from 'react-select'
import students from './data/students.json';
import courses from './data/courses.json';
import { format } from "date-fns";
import { FiEdit } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function App() {

  const [students_list, set_student_list] = useState("");
  const [courses_list, set_courses_list] = useState("");
  const [filtered_student, set_filtered_student] = useState("");
  const [student_profile_edit_enabled, set_student_profile_edit_enabled] = useState(false);
  const [enrolment_edit_enabled, set_enrolment_edit_enabled] = useState(false);
  const [enrol_button_disabled, set_enrol_button_disabled] = useState(true);

  useEffect(() => {
    (async () => {
      await PageLoad();
    })();
  }, []);

  var PageLoad = async () => {
    var students_list_temp = [];
    students.forEach((item) => {
      students_list_temp.push({
        value: item,
        label: item.DisplayName + " (KnownAs: " + item.KnownAs + ", Id:" + item.StudentId + ")"
      })
    })
    set_student_list(students_list_temp);
  }

  var LoadCourses = async () => {
    var courses_list_temp = [];
    courses.forEach((item) => {
      var disable_course = filtered_student?.CourseEnrolment.find(student_course => student_course.Course.CourseCode === item.CourseCode) == undefined ? false : true;
      courses_list_temp.push({
        value: item,
        label: item.CourseName + " (Code: " + item.CourseCode + ")",
        disabled: disable_course
      })
    })
    set_courses_list(courses_list_temp);
  }


  var FilterStudent = async (event) => {
    set_filtered_student(event.value);
    set_student_profile_edit_enabled(false)
  }

  var EditStudentDetail = (event) => {
    var student_detail = {
      "FirstName": event.target.id === "FirstName" ? event.target.value : filtered_student.FirstName,
      "LastName": event.target.id === "LastName" ? event.target.value : filtered_student.LastName,
      "KnownAs": event.target.id === "KnownAs" ? event.target.value : filtered_student.KnownAs,
      "DisplayName": event.target.id === "DisplayName" ? event.target.value : filtered_student.DisplayName,
      "DateOfBirth": event.target.id === "DateOfBirth" ? event.target.value : filtered_student.DateOfBirth,
      "HomeOrOverseas": event.target.id === "H" || event.target.id === "O" ? event.target.id : filtered_student.HomeOrOverseas
    }
    set_filtered_student(student_detail);
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            Student Enrollment
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      <div>
        <div style={{ width: "75%", margin: "0 auto" }}>
          <Select
            defaultValue={{ label: 'Search Students...' }}
            onChange={FilterStudent}
            options={students_list} />
        </div>
        <br /><br />
        <div style={{ width: "75%", margin: "0 auto" }}>
          {
            filtered_student !== "" ?
              <Card>
                <Card.Body>
                  <div className="d-flex">
                    <div>
                      <h3><b>Student Profile &nbsp;</b></h3>
                    </div>
                    <div>
                      <h4
                        onClick={() => { set_student_profile_edit_enabled(true) }}
                        style={{ cursor: "pointer" }}>
                        <FiEdit />
                      </h4>
                    </div>
                  </div>
                  <br />
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Student Id &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="StudentId"
                      value={filtered_student?.StudentId}
                      disabled
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>First Name &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="FirstName"
                      value={filtered_student?.FirstName}
                      onChange={EditStudentDetail}
                      disabled={!student_profile_edit_enabled}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Last Name &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="LastName"
                      value={filtered_student?.LastName}
                      onChange={EditStudentDetail}
                      disabled={!student_profile_edit_enabled}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Known As &emsp;&emsp;&emsp;&emsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="KnownAs"
                      value={filtered_student?.KnownAs}
                      onChange={EditStudentDetail}
                      disabled={!student_profile_edit_enabled}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Display Name &emsp;&emsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="DisplayName"
                      value={filtered_student?.DisplayName}
                      onChange={EditStudentDetail}
                      disabled={!student_profile_edit_enabled}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <div className='d-flex'>
                      <InputGroup.Text
                        style={{ backgroundColor: "darkgrey" }}
                      ><b>Date Of Birth &emsp;&emsp;&nbsp;&nbsp;&nbsp;:</b>
                      </InputGroup.Text>
                      {
                        !student_profile_edit_enabled ?
                          <div>
                            <Form.Control
                              id="DateOfBirth"
                              value={format(new Date(filtered_student?.DateOfBirth), "dd/MM/yyyy")}
                              disabled
                            />
                          </div>
                          :
                          <div>
                            <DatePicker
                              showIcon
                              selected={new Date(filtered_student?.DateOfBirth)}
                              onChange={(date) => {
                                var e = {};
                                e.target = {};
                                e.target.value = format(date, "yyyy-MM-dd") + "T00:00:00";
                                e.target.id = "DateOfBirth"
                                EditStudentDetail(e)
                              }
                              }
                              dateFormat="dd/MM/yyyy"
                            />
                          </div>
                      }
                    </div>
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>University Email &emsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="UniversityEmail"
                      value={filtered_student?.UniversityEmail}
                      disabled
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Network Id &emsp;&emsp;&emsp;&nbsp;&nbsp;&nbsp;:</b></InputGroup.Text>
                    <Form.Control
                      id="NetworkId"
                      value={filtered_student?.NetworkId}
                      disabled
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: "darkgrey" }}><b>Home Or Overseas :</b></InputGroup.Text>
                    &nbsp;&nbsp;
                    <span style={{ padding: "8px 0" }}>
                      <Form.Check
                        inline
                        label="Home"
                        type='radio'
                        id='H'
                        checked={filtered_student?.HomeOrOverseas === "H"}
                        onClick={EditStudentDetail}
                        disabled={!student_profile_edit_enabled}
                      />
                      <Form.Check
                        inline
                        label="Overseas"
                        type='radio'
                        id='O'
                        checked={filtered_student?.HomeOrOverseas === "O"}
                        onClick={EditStudentDetail}
                        disabled={!student_profile_edit_enabled}
                      />
                    </span>
                  </InputGroup>
                  <br />
                  <>
                    {
                      student_profile_edit_enabled ?
                        <>
                          <div className='d-flex justify-content-center'>
                            <Button
                              onClick={() => {
                                //console.log(filtered_student);
                                set_student_profile_edit_enabled(false)
                              }}
                              variant="primary">
                              Submit
                            </Button>
                          </div>
                          <br />
                          <br />
                        </>
                        :
                        <></>}
                  </>
                  <div className="d-flex">
                    <div>
                      <h3><b>Enroled Courses &nbsp;</b></h3>
                    </div>
                    <div>
                      <h4
                        onClick={async () => {
                          set_enrolment_edit_enabled(true);
                          await LoadCourses();
                        }}
                        style={{ cursor: "pointer" }}>
                        <FiEdit />
                      </h4>
                    </div>
                  </div>
                  <>
                    {
                      enrolment_edit_enabled ?
                        <>
                          <br />
                          <div style={{ width: "80%", margin: "0 auto" }}>
                            <Select
                              defaultValue={{ label: 'Search Courses to enrol...' }}
                              onChange={(e) => set_enrol_button_disabled(false)}
                              options={courses_list}
                              isOptionDisabled={(option) => option.disabled}
                            />
                          </div>
                          <br />
                          <div className='d-flex justify-content-center'>
                            <Button
                              onClick={() => {
                                set_enrolment_edit_enabled(false)
                                set_enrol_button_disabled(true)
                              }}
                              disabled={enrol_button_disabled}
                              variant="primary">
                              Enrol
                            </Button>
                          </div>
                          <br />
                          <br />
                        </>
                        :
                        <></>
                    }
                  </>
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Enrolment Id</th>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Academic Year</th>
                        <th>Year Of Study</th>
                        <th>Mode Of Attendance</th>
                        <th>Enrolment Status</th>
                        <th>Course Entry Date</th>
                        <th>Expected End Date</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered_student?.CourseEnrolment?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item?.EnrolmentId ? item?.EnrolmentId : "NA"}</td>
                            <td>{item?.Course?.CourseCode ? item?.Course?.CourseCode : "NA"}</td>
                            <td>{item?.Course?.CourseName ? item?.Course?.CourseName : "NA"}</td>
                            <td>{item?.AcademicYear ? item?.AcademicYear : "NA"}</td>
                            <td>{item?.YearOfStudy ? item?.YearOfStudy : "NA"}</td>
                            <td>{item?.ModeOfAttendance ? item?.ModeOfAttendance : "NA"}</td>
                            <td>{item?.EnrolmentStatus ? item?.EnrolmentStatus : "NA"}</td>
                            <td>{item?.CourseEntryDate ? format(new Date(item?.CourseEntryDate), "dd/MM/yyyy") : "NA"}</td>
                            <td>{item?.ExpectedEndDate ? format(new Date(item?.ExpectedEndDate), "dd/MM/yyyy") : "NA"}</td>
                            <td><Button
                              onClick={() => {

                              }}
                              variant="danger"
                              disabled={filtered_student?.CourseEnrolment.length <= 1}>

                              Disenrol
                            </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              :
              <Card className="text-center">
                <Card.Body><h2>Please Select a Student..!</h2></Card.Body>
              </Card>
          }
        </div>
      </div>
    </>
  );
}

export default App;
