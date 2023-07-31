// cannister code goes here
import {$query, $update, Record, StableBTreeMap, Vec, match, Result, nat64, ic, Opt, } from 'azle'
import { v4 as uuidv4 } from 'uuid';

type SubjectType = Record<{
    id: string;
    name: string;
    created_at: nat64;
    updated_at: Opt<nat64>;
    students: Vec<StudentType>;
}>
type StudentType= Record<{
    id: string;
    name: string;
    password: string;
    subjects: Vec<SubjectType>;
    created_at: nat64;
    updated_at: Opt<nat64>;
}>
type StudentProps= Record<Omit<StudentType, 'id' | 'created_at' | 'updated_at'>>
type AssignmentType=Record<{
    id: string;
    name: string;
    subject: SubjectType;
    iscompleted: boolean;
    issubmitted: boolean;
    task: Vec<string>;
    created_at: nat64;
    updated_at: Opt<nat64>;
}>
type SubmissionType=Record<{
    id: string;
    assignment: AssignmentType;
    student: StudentType;
    issubmitted: boolean;
    task: Vec<string>;
    created_at: nat64;
    updated_at: Opt<nat64>;
}>
type TeacherType= Record<{
    id: string;
    name: string;
    password: string;
    subjects: Vec<SubjectType>;
    created_at: nat64;
    updated_at: Opt<nat64>;
}>
type ClassType=Record<{
    id: string;
    name: string;
    students: Vec<StudentType>;
    teacher: TeacherType;
    created_at: nat64;
    updated_at: Opt<nat64>;
}>
const subjects = new StableBTreeMap<string, SubjectType>(0,44,1024);
const students = new StableBTreeMap<string, StudentType>(0,44,1024);
const assignments = new StableBTreeMap<string, AssignmentType>(0,44,1024);
const submissions = new StableBTreeMap<string, SubmissionType>(0,44,1024);
const teachers = new StableBTreeMap<string, TeacherType>(0,44,1024);
const classes = new StableBTreeMap<string, ClassType>(0,44,1024);

$query
export function getStudents(): Result<Vec<StudentType>, string> {
    return Result.Ok(students.values());
}
$query
export function getStudent(id: string): Result<StudentType, string> {
    return match(students.get(id), {
        Some: (student) => Result.Ok<StudentType, string>(student),
        None: () => Result.Err<StudentType, string>(`No student found`),
    });
}
$update
export function createStudent(name: string, password: string): Result<StudentType, string> {
    const id = uuidv4();
    const student = {
        id,
        name,
        password,
        subjects: [],
        created_at: ic.time(),
        updated_at: Opt.None,
    };
    students.insert(id, student);
    return Result.Ok(student);
}
$update
export function updateStudent(id: string, studentPayload: StudentProps): Result<StudentType, string> {
    return match(students.get(id), {
        Some: (student) => {
            const updatedStudent = {
                ...student,
                ...studentPayload,
                updated_at: Opt.Some(ic.time()),
            };
            students.insert(id, updatedStudent);
            return Result.Ok<StudentType, string>(updatedStudent);
        },
        None: () => Result.Err<StudentType, string>(`Update failed`),
    });
}
$update
export function deleteStudent(id: string): Result<StudentType, string> {
    return match(students.remove(id), {
        Some: (student) => Result.Ok<StudentType, string>(student),
        None: () => Result.Err<StudentType, string>(`Delete failed`),
    });
}
$query
export function getSubjects(): Result<Vec<SubjectType>, string> {
    return Result.Ok(subjects.values());
}
$query
export function getSubject(id: string): Result<SubjectType, string> {
    return match(subjects.get(id), {
        Some: (subject) => Result.Ok<SubjectType, string>(subject),
        None: () => Result.Err<SubjectType, string>(`No subject found`),
    });
}
$update
export function createSubject(name: string): Result<SubjectType, string> {
    const id = uuidv4();
    const subject = {
        id,
        name,
        students: [],
        created_at: ic.time(),
        updated_at: Opt.None,
    };
    subjects.insert(id, subject);
    return Result.Ok(subject);
}
$update
export function updateSubject(id: string, name: string): Result<SubjectType, string> {
    return match(subjects.get(id), {
        Some: (subject) => {
            const updatedSubject = {
                ...subject,
                name,
                updated_at: Opt.Some(ic.time()),
            };
            subjects.insert(id, updatedSubject);
            return Result.Ok<SubjectType, string>(updatedSubject);
        },
        None: () => Result.Err<SubjectType, string>(`Update failed`),
    });
}
$update
export function deleteSubject(id: string): Result<SubjectType, string> {
    return match(subjects.remove(id), {
        Some: (subject) => Result.Ok<SubjectType, string>(subject),
        None: () => Result.Err<SubjectType, string>(`Delete failed`),
    });
}
$query
export function getAssignments(): Result<Vec<AssignmentType>, string> {
    return Result.Ok(assignments.values());
}
$query
export function getAssignment(id: string): Result<AssignmentType, string> {
    return match(assignments.get(id), {
        Some: (assignment) => Result.Ok<AssignmentType, string>(assignment),
        None: () => Result.Err<AssignmentType, string>(`No assignment found`),
    });
}
$update
export function createAssignment(name: string, subject: SubjectType, task: Vec<string>): Result<AssignmentType, string> {
    const id = uuidv4();
    const assignment = {
        id,
        name,
        subject,
        iscompleted: false,
        issubmitted: false,
        task,
        created_at: ic.time(),
        updated_at: Opt.None,
    };
    assignments.insert(id, assignment);
    return Result.Ok(assignment);
}
$update
export function updateAssignment(id: string, name: string, subject: SubjectType, task: Vec<string>): Result<AssignmentType, string> {
    return match(assignments.get(id), {
        Some: (assignment) => {
            const updatedAssignment = {
                ...assignment,
                name,
                subject,
                task,
                updated_at: Opt.Some(ic.time()),
            };
            assignments.insert(id, updatedAssignment);
            return Result.Ok<AssignmentType, string>(updatedAssignment);
        },
        None: () => Result.Err<AssignmentType, string>(`Update failed`),
    });
}
$update
export function deleteAssignment(id: string): Result<AssignmentType, string> {
    return match(assignments.remove(id), {
        Some: (assignment) => Result.Ok<AssignmentType, string>(assignment),
        None: () => Result.Err<AssignmentType, string>(`Delete failed`),
    });
}
$query
export function getSubmissions(): Result<Vec<SubmissionType>, string> {
    return Result.Ok(submissions.values());
}
$query
export function getSubmission(id: string): Result<SubmissionType, string> {
    return match(submissions.get(id), {
        Some: (submission) => Result.Ok<SubmissionType, string>(submission),
        None: () => Result.Err<SubmissionType, string>(`No submission found`),
    });
}
$update
export function createSubmission(student: StudentType, assignment: AssignmentType, task: string[]): Result<SubmissionType, string> {
    const id = uuidv4();
    const submission: SubmissionType = {
        id,
        student,
        assignment,
        task,
        issubmitted: true,
        created_at: ic.time(),
        updated_at: Opt.None,
    };
    submissions.insert(id, submission);
    return Result.Ok<SubmissionType, string>(submission);
}
$update
export function updateSubmission(id: string, student: StudentType, assignment: AssignmentType, task: Vec<string>): Result<SubmissionType, string> {
    return match(submissions.get(id), {
        Some: (submission) => {
            const updatedSubmission = {
                ...submission,
                student,
                assignment,
                task,
                updated_at: Opt.Some(ic.time()),
            };
            submissions.insert(id, updatedSubmission);
            return Result.Ok<SubmissionType, string>(updatedSubmission);
        },
        None: () => Result.Err<SubmissionType, string>(`Update failed`),
    });
}
$update
export function deleteSubmission(id: string): Result<SubmissionType, string> {
    return match(submissions.remove(id), {
        Some: (submission) => Result.Ok<SubmissionType, string>(submission),
        None: () => Result.Err<SubmissionType, string>(`Delete failed`),
    });
}
