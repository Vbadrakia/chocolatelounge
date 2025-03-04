declare module '../hooks/use-toast' {
  export const useToast: () => {
    toast: (message: { title: string; description: string }) => void;
  };
}
