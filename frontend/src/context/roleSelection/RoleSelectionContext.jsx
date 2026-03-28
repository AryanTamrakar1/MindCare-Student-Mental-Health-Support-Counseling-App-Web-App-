import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RoleSelectionContext = createContext(null);

export const RoleSelectionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [googleData, setGoogleData] = useState(null);

  useEffect(
    function () {
      if (location.state && location.state.googleData) {
        setGoogleData(location.state.googleData);
      }
    },
    [location.state],
  );

  const handleChoice = (role) => {
    const path =
      role === "Student" ? "/register/student" : "/register/counselor";

    navigate(path, {
      state: googleData ? { googleData } : {}, 
    });
  };

  const goToHome = () => {
    navigate("/");
  };

  const getUserName = () => {
    if (googleData && googleData.name) {
      return googleData.name;
    }
    return "";
  };

  return (
    <RoleSelectionContext.Provider
      value={{
        googleData,
        handleChoice,
        goToHome,
        getUserName,
      }}
    >
      {children}
    </RoleSelectionContext.Provider>
  );
};

export const useRoleSelectionContext = () => {
  const ctx = useContext(RoleSelectionContext);
  if (!ctx)
    throw new Error(
      "useRoleSelectionContext must be used inside RoleSelectionProvider",
    );
  return ctx;
};
