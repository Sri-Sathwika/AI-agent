type Source = {
  source: string;
  page: string;
  content: string;
};

let sources: Source[] = [];

let listeners: (() => void)[] = [];

export const sourceStore = {

  getSources() {
    return sources;
  },

  setSources(newSources: Source[]) {

    sources = newSources;

    listeners.forEach(
      listener => listener()
    );
  },

  subscribe(listener: () => void) {

    listeners.push(listener);

    return () => {

      listeners = listeners.filter(
        l => l !== listener
      );

    };
  }

};