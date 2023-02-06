import React, { useState, useEffect } from 'react';
import './App.css';
import { Navbar, Form, Button, Card, Container, Table } from 'react-bootstrap';
import Select from 'react-select'
import students from './data/students.json';
import courses from './data/courses.json';
import { format } from "date-fns";


function App() {

  const [students_list, set_student_list] = useState("");
  const [filtered_student, set_filtered_student] = useState("");

  useEffect(() => {
    (async () => {
      var students_list_temp = [];
      students.forEach((item) => {
        students_list_temp.push({
          value: item,
          label: item.DisplayName + " (KnownAs: " + item.KnownAs + ", Id:" + item.StudentId + ")"
        })
      })
      //students_list_temp = students_list_temp.sort((a, b) => (a.DisplayName > b.DisplayName ? 1 : -1))
      set_student_list(students_list_temp);
    })();
  }, []);


  var FilterStudent = async (event) => {
    set_filtered_student(event.value);
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
            filtered_student != "" ?
              <Card>
                <Card.Body>
                  <Form>
                    <h5><b>Student Id</b>: {filtered_student?.StudentId}</h5>
                    <h5><b>First Name</b>: {filtered_student?.FirstName}</h5>
                    <h5><b>Last Name</b>: {filtered_student?.LastName}</h5>
                    <h5><b>Known As</b>: {filtered_student?.KnownAs}</h5>
                    <h5><b>Display Name</b>: {filtered_student?.DisplayName}</h5>
                    <h5><b>Date Of Birth</b>: {filtered_student?.DateOfBirth}</h5>
                    <h5><b>University Email</b>: {filtered_student?.UniversityEmail}</h5>
                    <h5><b>Network Id</b>: {filtered_student?.NetworkId}</h5>
                    <h5><b>Home Or Overseas</b>: {filtered_student?.HomeOrOverseas == "H" ? "Home" : "Overseas"}</h5>
                    <br/>
                    <h4><b>Enroled Courses:</b></h4>
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
                              <td>{item?.ExpectedEndDate ? format(new Date(item?.ExpectedEndDate), "dd/MM/yyyy"): "NA"}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </Table>
                  </Form>
                </Card.Body>
              </Card> :
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
