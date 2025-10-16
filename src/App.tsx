import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context";

// Interfaces
import { UserData } from "./Interfaces";

// Components
import Dashboard from "./components/main/Main";
import AddWords from "./components/main/add/AddWords";
import Header from "./components/other/Header";
import Signin from "./components/user/Signin";
import Signup from "./components/user/Signup";
import { NoPage } from "./components/other/NoPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWordsQuery } from "./hooks/useWordsQuery";

function App(): React.ReactElement {
  // Context
  const [user, setUser] = useState<UserData>(undefined);
  const queryClient = new QueryClient()
  const { getUpdates } = useWordsQuery();


  useEffect(() => {
    const tempUser = JSON.parse(localStorage.getItem("languageSquaresUser") || "{}")
    if (!tempUser.token) {
      setUser(null)
      return
    }
    // tempUser.words = []; // remove words; you should use tanstack query now.
    setUser(tempUser)
  }, [])

  useEffect(() => {
    if (user?.token) {
      getUpdates.refetch();
    }
  }, [user?.token]);

  useEffect(() => {
    if (user === undefined) {
      return
    }
    if (user?.token) {
      localStorage.setItem("languageSquaresUser", JSON.stringify(user))
      console.debug("User changed.")
    } else {
      localStorage.removeItem("languageSquaresUser")
      console.debug("Signed out.")
    }
  }, [user])

  // Component
  if (user === null || user === undefined) {
    return (
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={[user, setUser]}>
          <BrowserRouter basename="/language-squares">
            <Routes>
              <Route path="/" element={<Header />}>
                <Route index element={<Signin />} />
                <Route path="sign-up" element={<Signup />} />
                <Route path="sign-in" element={<Signin />} />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter basename="/language-squares">
          <Routes>
            <Route path="/" element={<Header />}>
              <Route index element={<Dashboard />} />
              <Route path="add-words" element={<AddWords />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;