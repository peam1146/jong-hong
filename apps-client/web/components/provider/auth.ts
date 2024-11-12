import { createContext, useContext } from 'react'

const AuthContext = createContext<{
  token: string | null
  setToken: (token: string) => void
}>({
  token: null,
  setToken: () => {},
})

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = AuthContext.Provider
