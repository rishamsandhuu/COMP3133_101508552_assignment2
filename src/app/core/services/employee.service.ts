import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
  ADD_EMPLOYEE_MUTATION,
  DELETE_EMPLOYEE_BY_EID_MUTATION,
  GET_ALL_EMPLOYEES_QUERY,
  GET_EMPLOYEE_BY_EID_QUERY,
  SEARCH_EMPLOYEE_QUERY,
  UPDATE_EMPLOYEE_BY_EID_MUTATION,
} from '../../graphql/employee.queries';

export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string | null;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface EmployeeResponse {
  message: string;
  employee: Employee;
}

export interface DeleteResponse {
  message: string;
}

export interface AddEmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo_base64?: string;
  employee_photo?: string;
}

export interface UpdateEmployeeInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  designation?: string;
  salary?: number;
  date_of_joining?: string;
  department?: string;
  employee_photo_base64?: string;
  employee_photo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo
      .watchQuery<{ getAllEmployees: Employee[] }>({
        query: GET_ALL_EMPLOYEES_QUERY,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result) => (result.data?.getAllEmployees ?? []) as Employee[])
      );
  }

  getEmployeeByEid(eid: string): Observable<Employee> {
    return this.apollo
      .query<{ getEmployeeByEid: Employee }>({
        query: GET_EMPLOYEE_BY_EID_QUERY,
        variables: { eid },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => {
          const employee = result.data?.getEmployeeByEid as Employee | undefined;
          if (!employee) {
            throw new Error('Employee not found');
          }
          return employee;
        })
      );
  }

  searchEmployees(designation?: string, department?: string): Observable<Employee[]> {
    return this.apollo
      .query<{ searchEmployee: Employee[] }>({
        query: SEARCH_EMPLOYEE_QUERY,
        variables: {
          designation: designation?.trim() || null,
          department: department?.trim() || null,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((result) => (result.data?.searchEmployee ?? []) as Employee[])
      );
  }

  addEmployee(input: AddEmployeeInput): Observable<EmployeeResponse> {
    return this.apollo
      .mutate<{ addEmployee: EmployeeResponse }>({
        mutation: ADD_EMPLOYEE_MUTATION,
        variables: input,
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
        awaitRefetchQueries: true,
      })
      .pipe(
        map((result) => {
          const payload = result.data?.addEmployee as EmployeeResponse | undefined;
          if (!payload) {
            throw new Error('Failed to add employee');
          }
          return payload;
        })
      );
  }

  updateEmployeeByEid(eid: string, input: UpdateEmployeeInput): Observable<EmployeeResponse> {
    return this.apollo
      .mutate<{ updateEmployeeByEid: EmployeeResponse }>({
        mutation: UPDATE_EMPLOYEE_BY_EID_MUTATION,
        variables: { eid, ...input },
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
        awaitRefetchQueries: true,
      })
      .pipe(
        map((result) => {
          const payload = result.data?.updateEmployeeByEid as EmployeeResponse | undefined;
          if (!payload) {
            throw new Error('Failed to update employee');
          }
          return payload;
        })
      );
  }

  deleteEmployeeByEid(eid: string): Observable<DeleteResponse> {
    return this.apollo
      .mutate<{ deleteEmployeeByEid: DeleteResponse }>({
        mutation: DELETE_EMPLOYEE_BY_EID_MUTATION,
        variables: { eid },
        refetchQueries: [{ query: GET_ALL_EMPLOYEES_QUERY }],
        awaitRefetchQueries: true,
      })
      .pipe(
        map((result) => {
          const payload = result.data?.deleteEmployeeByEid as DeleteResponse | undefined;
          if (!payload) {
            throw new Error('Failed to delete employee');
          }
          return payload;
        })
      );
  }
}