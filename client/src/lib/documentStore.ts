type Listener = () => void;

let listeners: Listener[] = [];

export const documentStore = {
  subscribe(listener: Listener) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(
        (l) => l !== listener
      );
    };
  },

  notify() {
    listeners.forEach((l) => l());
  },
};