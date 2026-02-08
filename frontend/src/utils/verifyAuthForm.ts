import { RegisterRequest } from "@/types/auth/register";

export function verifyRegistrationForm(formData: RegisterRequest) {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
        errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (!formData.username) {
        errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters long';
    }

    if (!formData.displayName) {
        errors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 3) {
        errors.displayName = 'Display name must be at least 3 characters long';
    }

    if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required';
    } else if (new Date(formData.dateOfBirth) > new Date()) {
        errors.dateOfBirth = 'Invalid date of birth';
    }

    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }

    return errors;
}