import { createContext, useContext, useState } from "react";

const ResourceFilterContext = createContext(null);

export const ResourceFilterProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeTabApplied, setActiveTabApplied] = useState("all");

  const [searchDraft, setSearchDraft] = useState("");
  const [typeDraft, setTypeDraft] = useState("All");
  const [categoryDraft, setCategoryDraft] = useState("All");
  const [sortDraft, setSortDraft] = useState("None");
  const [counselorDraft, setCounselorDraft] = useState(false);

  const [searchApplied, setSearchApplied] = useState("");
  const [typeApplied, setTypeApplied] = useState("All");
  const [categoryApplied, setCategoryApplied] = useState("All");
  const [sortApplied, setSortApplied] = useState("None");
  const [counselorApplied, setCounselorApplied] = useState(false);

  const handleSearch = () => {
    setSearchApplied(searchDraft);
  };

  const handleClearSearch = () => {
    setSearchDraft("");
    setSearchApplied("");
  };

  const handleApplyFilter = () => {
    setTypeApplied(typeDraft);
    setCategoryApplied(categoryDraft);
    setSortApplied(sortDraft);
    setCounselorApplied(counselorDraft);
    setActiveTabApplied(activeTab);
  };

  const handleClearFilter = () => {
    setTypeDraft("All");
    setCategoryDraft("All");
    setSortDraft("None");
    setCounselorDraft(false);
    setTypeApplied("All");
    setCategoryApplied("All");
    setSortApplied("None");
    setCounselorApplied(false);
    setSearchDraft("");
    setSearchApplied("");
    setActiveTab("all");
    setActiveTabApplied("all");
  };

  return (
    <ResourceFilterContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeTabApplied,
        setActiveTabApplied,
        searchDraft,
        setSearchDraft,
        typeDraft,
        setTypeDraft,
        categoryDraft,
        setCategoryDraft,
        sortDraft,
        setSortDraft,
        counselorDraft,
        setCounselorDraft,
        searchApplied,
        setSearchApplied,
        typeApplied,
        setTypeApplied,
        categoryApplied,
        setCategoryApplied,
        sortApplied,
        setSortApplied,
        counselorApplied,
        setCounselorApplied,
        handleSearch,
        handleClearSearch,
        handleApplyFilter,
        handleClearFilter,
      }}
    >
      {children}
    </ResourceFilterContext.Provider>
  );
};

export const useResourceFilterContext = () => {
  const ctx = useContext(ResourceFilterContext);
  if (!ctx)
    throw new Error(
      "useResourceFilterContext must be used inside ResourceFilterProvider"
    );
  return ctx;
};