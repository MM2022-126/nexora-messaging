const isBrowser = typeof window !== 'undefined';

export function safeParse(value) {
  if (!value || value === 'undefined' || value === 'null') return null;

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function getStorage(key, fallback = null) {
  if (!isBrowser) return fallback;

  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return fallback;

    const parsed = safeParse(value);
    return parsed === null && value !== 'null' ? value : parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

export function setStorage(key, value) {
  if (!isBrowser) return false;

  try {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, payload);
    return true;
  } catch (error) {
    return false;
  }
}

export function removeStorage(key) {
  if (!isBrowser) return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function clearStorage() {
  if (!isBrowser) return false;

  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    return false;
  }
}
