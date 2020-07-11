import { createContext } from 'react';

type UserContextType = {
  user: User | null;
  setUser: (value: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
