export interface Employee{
    id: number;
    name: string;
    title: string;
    role: string;
    email: string;
    password?: string;
    selected?: boolean;
}