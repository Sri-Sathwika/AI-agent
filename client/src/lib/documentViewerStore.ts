type Listener = () => void;

let currentDocument: string | null =
  null;

let listeners: Listener[] = [];

export const documentViewerStore = {
  getDocument() {
    return currentDocument;
  },

  setDocument(
    document: string | null
  ) {
    currentDocument = document;

    listeners.forEach(
      (listener) => listener()
    );
  },

  subscribe(listener: Listener) {
    listeners.push(listener);

    return () => {
      listeners = listeners.filter(
        (l) => l !== listener
      );
    };
  },
};