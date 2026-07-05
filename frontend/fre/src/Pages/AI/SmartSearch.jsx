import React from "react";
import SearchBar from "../../components/AI/SearchBar";

const SmartSearch = ({ searchQuery, setSearchQuery, isAISearch, setIsAISearch, onSearch, aiSearchLoading }) => {
  return (
    <div className="flex-shrink-0">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAISearch={isAISearch}
        setIsAISearch={setIsAISearch}
        onSearch={onSearch}
        aiSearchLoading={aiSearchLoading}
      />
    </div>
  );
};

export default SmartSearch;
