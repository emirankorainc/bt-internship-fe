import { useState } from "react";
import { Input } from "@app/components/ui/input";
import { UserCard } from "@app/features/users/UserCard";
import { FAKE_USERCARD } from "@app/constants/example";
import { X } from "lucide-react";

export const People = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => setSearchQuery("");

  return (
    <div className="flex w-full h-auto min-h-screen flex-col items-center bg-gray-100 px-10 pt-10">
      <div className="w-full h-[5%] relative">
        <Input
          className="w-full h-full pr-10"
          placeholder="Search users by name or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            <X className="h-4 w-4 cursor-pointer" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>

      <div className="flex flex-row gap-x-20 gap-y-10 w-full flex-wrap mt-10 pl-20">
        {[...Array(8)].map((_, i) => (
          <UserCard key={i} userInfo={FAKE_USERCARD} />
        ))}
      </div>
    </div>
  );
};
