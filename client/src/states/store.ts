// store.ts
import { create } from "zustand";

// Define the type for the state and actions
interface UserStore {
  user: any;
  setUser: (newUser: any) => void;
}

// Create the store using Zustand's create function
const useUserStore = create<UserStore>((set) => ({
  user: "",
  setUser: (newUser) => set({ user: newUser }), // Function to update the state
}));

export default useUserStore;
