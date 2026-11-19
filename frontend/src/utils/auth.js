// Authentication management with persistent user registry and demo presets

const AUTH_KEYS = {
  CURRENT_USER: 'pennywise_current_user_v1',
  USERS_REGISTRY: 'pennywise_registered_users_v1'
};

const DEFAULT_PRESET_USERS = [
  {
    id: 'usr_aarav',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    password: 'password123',
    persona: 'College Student',
    avatar: '🎓',
    joinedDate: '2026-10-15'
  },
  {
    id: 'usr_priya',
    name: 'Priya Patel',
    email: 'priya@example.com',
    password: 'password123',
    persona: 'Young Professional',
    avatar: '💼',
    joinedDate: '2026-09-01'
  }
];

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USERS_REGISTRY);
    if (!raw) {
      localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(DEFAULT_PRESET_USERS));
      return DEFAULT_PRESET_USERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PRESET_USERS;
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to Aarav (logged-in default user)
      const defaultUser = DEFAULT_PRESET_USERS[0];
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_PRESET_USERS[0];
  }
}

export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

export function loginUser(email, password) {
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();
  const found = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (found) {
    setCurrentUser(found);
    return { success: true, user: found };
  }
  return { success: false, error: 'Invalid email or password.' };
}

export function signupUser({ name, email, password, persona = 'College Student' }) {
  const users = getRegisteredUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const personaAvatars = {
    'Teen / High School': '🎒',
    'College Student': '🎓',
    'Young Professional': '💼',
    'Finance Beginner': '🌱'
  };

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password,
    persona,
    avatar: personaAvatars[persona] || '👤',
    joinedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function logoutUser() {
  localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
}
