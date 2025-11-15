export interface User {
    id: string;
    name: string;
    surname: string;
    phone: string | null;
    email: string;
    profilePictureUrl: string | null;
    roles: string[];
}