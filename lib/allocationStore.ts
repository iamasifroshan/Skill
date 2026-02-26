// Student ↔ Faculty allocation store (localStorage-backed)
// Admin writes → Faculty dashboard reads

import { STUDENTS } from "@/lib/mockData";

export type Allocation = {
    facultyId: string;
    studentIds: string[];
};

const KEY = "skill_allocations";

// Default: all students go to Dr. Sarah Smith (f1)
const DEFAULT_ALLOCATIONS: Allocation[] = [
    { facultyId: "f1", studentIds: STUDENTS.map(s => s.id) },
    { facultyId: "f2", studentIds: [] },
    { facultyId: "f3", studentIds: [] },
    { facultyId: "f4", studentIds: [] },
];

export function getAllocations(): Allocation[] {
    if (typeof window === "undefined") return DEFAULT_ALLOCATIONS;
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) return JSON.parse(raw) as Allocation[];
    } catch { }
    return DEFAULT_ALLOCATIONS;
}

export function saveAllocations(allocations: Allocation[]): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(KEY, JSON.stringify(allocations));
    } catch { }
}

/** Get which students are allocated to a given faculty id */
export function getStudentsForFaculty(facultyId: string): string[] {
    const allocations = getAllocations();
    return allocations.find(a => a.facultyId === facultyId)?.studentIds ?? [];
}

/** Get which students are allocated to a faculty by email */
export function getStudentsForFacultyByEmail(email: string): string[] {
    const emailToId: Record<string, string> = {
        "sarahsmith.faculty@skillsync.com": "f1",
        "rajkumar.faculty@skillsync.com": "f2",
        "priyanair.faculty@skillsync.com": "f3",
        "anilsharma.faculty@skillsync.com": "f4",
    };
    const id = emailToId[email];
    if (!id) return STUDENTS.map(s => s.id);

    // For recognized faculty, return their assigned students PLUS any student not in the original mock data 
    // (this handles admin-created students)
    const all = getAllocations();
    const found = all.find(a => a.facultyId === id);
    return found ? found.studentIds : [];
}

/** Assign a student to a faculty (Additive) */
export function assignStudent(studentId: string, newFacultyId: string): void {
    const allocations = getAllocations();
    const target = allocations.find(a => a.facultyId === newFacultyId);
    if (target) {
        if (!target.studentIds.includes(studentId)) {
            target.studentIds.push(studentId);
        }
    } else {
        allocations.push({ facultyId: newFacultyId, studentIds: [studentId] });
    }
    saveAllocations(allocations);
}

/** Bulk assign multiple students to a faculty */
export function bulkAssign(studentIds: string[], facultyId: string): void {
    const allocations = getAllocations();
    const target = allocations.find(a => a.facultyId === facultyId);
    if (target) {
        studentIds.forEach(id => {
            if (!target.studentIds.includes(id)) target.studentIds.push(id);
        });
    } else {
        allocations.push({ facultyId, studentIds: [...studentIds] });
    }
    saveAllocations(allocations);
}

/** Get all faculty IDs a student is assigned to */
export function getFacultiesForStudent(studentId: string): string[] {
    const allocations = getAllocations();
    return allocations
        .filter(a => a.studentIds.includes(studentId))
        .map(a => a.facultyId);
}

/** Unassign a student from a faculty */
export function unassignStudent(studentId: string, facultyId: string): void {
    const allocations = getAllocations();
    const target = allocations.find(a => a.facultyId === facultyId);
    if (target) {
        target.studentIds = target.studentIds.filter(id => id !== studentId);
        saveAllocations(allocations);
    }
}
