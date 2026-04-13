import { gql } from 'apollo-angular';

export const GET_ALL_EMPLOYEES_QUERY = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const GET_EMPLOYEE_BY_EID_QUERY = gql`
  query GetEmployeeByEid($eid: ID!) {
    getEmployeeByEid(eid: $eid) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const SEARCH_EMPLOYEE_QUERY = gql`
  query SearchEmployee($designation: String, $department: String) {
    searchEmployee(designation: $designation, department: $department) {
      _id
      first_name
      last_name
      email
      gender
      designation
      salary
      date_of_joining
      department
      employee_photo
      created_at
      updated_at
    }
  }
`;

export const ADD_EMPLOYEE_MUTATION = gql`
  mutation AddEmployee(
    $first_name: String!
    $last_name: String!
    $email: String!
    $gender: String
    $designation: String!
    $salary: Float!
    $date_of_joining: DateTime!
    $department: String!
    $employee_photo_base64: String
    $employee_photo: String
  ) {
    addEmployee(
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo_base64: $employee_photo_base64
      employee_photo: $employee_photo
    ) {
      message
      employee {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  }
`;

export const UPDATE_EMPLOYEE_BY_EID_MUTATION = gql`
  mutation UpdateEmployeeByEid(
    $eid: ID!
    $first_name: String
    $last_name: String
    $email: String
    $gender: String
    $designation: String
    $salary: Float
    $date_of_joining: DateTime
    $department: String
    $employee_photo_base64: String
    $employee_photo: String
  ) {
    updateEmployeeByEid(
      eid: $eid
      first_name: $first_name
      last_name: $last_name
      email: $email
      gender: $gender
      designation: $designation
      salary: $salary
      date_of_joining: $date_of_joining
      department: $department
      employee_photo_base64: $employee_photo_base64
      employee_photo: $employee_photo
    ) {
      message
      employee {
        _id
        first_name
        last_name
        email
        gender
        designation
        salary
        date_of_joining
        department
        employee_photo
        created_at
        updated_at
      }
    }
  }
`;

export const DELETE_EMPLOYEE_BY_EID_MUTATION = gql`
  mutation DeleteEmployeeByEid($eid: ID!) {
    deleteEmployeeByEid(eid: $eid) {
      message
    }
  }
`;