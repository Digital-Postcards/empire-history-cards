// Same rules the backend checks in UserService.isValidPassword

export const PASSWORD_HINT = "8-12 characters, with at least one letter and one number";

// Returns what's wrong with the password, or undefined if it's fine
export const getPasswordError = (password: string): string | undefined => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 12) return "Password can be at most 12 characters";
    if (!/[a-zA-Z]/.test(password)) return "Password must include at least one letter";
    if (!/[0-9]/.test(password)) return "Password must include at least one number";
    return undefined;
};
