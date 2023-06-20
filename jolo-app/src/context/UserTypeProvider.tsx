import React, { createContext, useContext, useState } from "react";

// Define your context
const UserTypeContext = createContext(null);

// Define a provider component
export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("rider"); // Initial state

  return (
    <UserTypeContext.Provider value={[userType, setUserType]}>
      {children}
    </UserTypeContext.Provider>
  );
};

// Create a custom hook to use the UserTypeContext, this is optional but it simplifies the usage
export const useUserType = () => {
  return useContext(UserTypeContext);
};
