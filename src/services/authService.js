// src/services/authService.js
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp, resetPassword, confirmResetPassword } from 'aws-amplify/auth';

// Sign Up
export const register = async (email, password) => {
    const { isSignUpComplete, userId } = await signUp({
        username: email,
        password,
        options: { userAttributes: { email } }
    });
    return { isSignUpComplete, userId };
};

// Confirm Sign Up (OTP from email)
export const confirmRegister = async (email, code) => {
    return await confirmSignUp({ username: email, confirmationCode: code });
};

// Sign In
export const login = async (email, password) => {
    const { isSignedIn, nextStep } = await signIn({ username: email, password });
    return { isSignedIn, nextStep };
};

// Sign Out
export const logout = async () => {
    await signOut();
};

// Get Current Logged-In User
export const getAuthUser = async () => {
    try {
        return await getCurrentUser();
    } catch {
        return null; // Not logged in
    }
};

// Forgot Password
export const forgotPassword = async (email) => {
    return await resetPassword({ username: email });
};

// Confirm New Password
export const confirmForgotPassword = async (email, code, newPassword) => {
    return await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
};
