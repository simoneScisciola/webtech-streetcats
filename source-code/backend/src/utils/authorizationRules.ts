export function isOwner(owner: string, user?: string): boolean {
    return user === owner;
}

export function isAdmin(role?: string): boolean {
    return role === "ADMIN";
}
