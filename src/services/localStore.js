class LocalStore {
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }
  static get(key) {
    const data = localStorage.getItem(key);
    if (data) {
      if (data === 'undefined' || data === 'null') {
        LocalStore.remove(key);
        return false;
      }
      try {
        return JSON.parse(data);
      } catch (e) {
        LocalStore.save(`${key}.${Date.now()}`, data);
        LocalStore.remove(key);
        return false;
      }
    }
    return false;
  }
  static remove(key) {
    localStorage.removeItem(key);
    return true;
  }
}

export default LocalStore;
