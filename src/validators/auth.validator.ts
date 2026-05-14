export interface AuthValidation {
	email?: string[];
	password?: string[];
}

export function validateEmail(email: string): string[] {
	const errors: string[] = [];
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!email) {
		errors.push("Email is required");
	} else if (!emailRegex.test(email)) {
		errors.push("Invalid email format");
	}

	return errors;
}

export function validatePassword(password: string): string[] {
	const errors: string[] = [];

	if (!password) {
		errors.push("Password is required");
	} else if (password.length < 6) {
		errors.push("Password must be at least 6 characters");
	} else if (password.length > 128) {
		errors.push("Password must be at most 128 characters");
	}

	return errors;
}

export function validateAuthRequest(data: any): AuthValidation {
	const errors: AuthValidation = {};

	const emailErrors = validateEmail(data.email);
	if (emailErrors.length > 0) {
		errors.email = emailErrors;
	}

	const passwordErrors = validatePassword(data.password);
	if (passwordErrors.length > 0) {
		errors.password = passwordErrors;
	}

	return errors;
}

export default { validateEmail, validatePassword, validateAuthRequest };
