"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateAuthRequest = validateAuthRequest;
function validateEmail(email) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errors.push("Email is required");
    }
    else if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }
    return errors;
}
function validatePassword(password) {
    const errors = [];
    if (!password) {
        errors.push("Password is required");
    }
    else if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
    }
    else if (password.length > 128) {
        errors.push("Password must be at most 128 characters");
    }
    return errors;
}
function validateAuthRequest(data) {
    const errors = {};
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
exports.default = { validateEmail, validatePassword, validateAuthRequest };
//# sourceMappingURL=auth.validator.js.map