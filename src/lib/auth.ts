import Store from 'electron-store';
import bcrypt from 'bcryptjs';

const schema = {
    userData: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            passwordHash: { type: 'string' }
        }
    }
};

// @ts-ignore TODO: fix this type error with electron-store
const store = new Store({ schema });

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'password'; // In a real app, prompt user to set this

// Initialize default credentials if not already set
if (!store.get('userData.username')) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(DEFAULT_PASSWORD, salt);
    store.set('userData', {
        username: DEFAULT_USERNAME,
        passwordHash: passwordHash
    });
    console.log('Default credentials initialized.');
}

export function signIn(username, password) {
    const storedUser = store.get('userData.username');
    const storedHash = store.get('userData.passwordHash');

    if (username === storedUser && bcrypt.compareSync(password, storedHash)) {
        return { success: true, message: 'Sign in successful' };
    } else {
        return { success: false, message: 'Invalid username or password' };
    }
}

export function getCurrentUser() {
    // In a local app, if sign-in is successful, we can assume the user is "logged in".
    // This function can be expanded if more user data needs to be stored/retrieved.
    return store.get('userData.username') ? { username: store.get('userData.username') } : null;
}

// Add a function to allow changing password (optional, for future enhancement)
export function changePassword(username, oldPassword, newPassword) {
    const authResult = signIn(username, oldPassword);
    if (authResult.success) {
        const salt = bcrypt.genSaltSync(10);
        const newPasswordHash = bcrypt.hashSync(newPassword, salt);
        store.set('userData.passwordHash', newPasswordHash);
        return { success: true, message: 'Password changed successfully' };
    } else {
        return { success: false, message: 'Invalid current password' };
    }
}
