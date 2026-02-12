/*
 * This library provides methods to validate input values.
 */

export function isUndefined(value: any): boolean {
    return typeof value === 'undefined';
}

// === Attributes validator functions ===

export function isIdValid(id: any): boolean {
    return isNumber(id);
}

export function isUsernameValid(username: any): boolean {
    return isString(username) && !isEmpty(username);
}

export function isEmailValid(email: any): boolean {
    return isString(email) && !isEmpty(email) && isEmail(email);
}

/*  Password must contain a uppercase character
    Password must contain a number character
    Password must contain a special character */
export function isPasswordValid(password: any): boolean {
    return isString(password) && !isEmpty(password) && hasUpperCase(password) && hasNumber(password) && hasSpecialChar(password);
}

export function isRoleNameValid(roleName: any): boolean {
    return isString(roleName) && !isEmpty(roleName) && isUpperCase(roleName);
}

export function isPhotoUrlValid(photoUrl: any): boolean {
    return isString(photoUrl) && !isEmpty(photoUrl);
}

export function isTitleValid(title: any): boolean {
    return isString(title) && !isEmpty(title);
}

export function isDescriptionValid(description: any): boolean {
    return isNull(description) || (isString(description) && !isEmpty(description));
}

export function isLatitudeValid(latitude: any): boolean {
    return isNumber(latitude) && isMin(latitude, -90) && isMax(latitude, 90);
}

export function isLongitudeValid(longitude: any): boolean {
    return isNumber(longitude) && isMin(longitude, -180) && isMax(longitude, 180);
}

export function isAddressValid(address: any): boolean {
    return isNull(address) || (isString(address) && !isEmpty(address));
}

export function isContentValid(content: any): boolean {
    return isString(content) && !isEmpty(content);
}

// === Basic validation functions ===

function isString(value: any) {
    return typeof value === 'string';
}

function isNumber(value: any) {
    return !isNaN(value) && typeof value === 'number';
}

function isNull(value: any) {
    return value === null;
}

function isEmpty(value: string) {
    return value.trim().length <= 0;
}

/* Email is of type A@B.C where:
    - A is at least one character and can't contain space or @
    - B is at least one character and can't contain space or @
    - C is at least one character and can't contain space or @ */
function isEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hasUpperCase(value: string) {
    return /[A-Z]/.test(value);
}

function hasNumber(value: string) {
    return /\d/.test(value);
}

function hasSpecialChar(value: string) {
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
}

function isUpperCase(value: string) {
    return value === value.toUpperCase();
}

function isMin(value: number, threshold: number) {
    return value >= threshold;
}

function isMax(value: number, threshold: number) {
    return value <= threshold;
}