
import { Search, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { toast } from "sonner";

interface UserManagementHeaderProps {
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  userGroups: string[];
  setShowAddUserDialog: (show: boolean) => void;
}

export function UserManagementHeader({
  selectedGroup,
  setSelectedGroup,
  searchTerm,
  setSearchTerm,
  userGroups,
  setShowAddUserDialog
}: UserManagementHeaderProps) {
  return (
    <div className="flex gap-4 items-center justify-between">
      <div className="flex gap-4 flex-1">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px] glass-panel">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            {userGroups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-panel w-full pl-10 pr-4 py-2 text-sm bg-secondary/30 text-white/80 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
          />
        </div>
      </div>
      
      <button 
        className="glass-panel px-4 py-2 text-sm font-medium text-white/90 hover:text-white flex items-center gap-2 hover:bg-white/5 transition-colors"
        onClick={() => {
          if (!selectedGroup) {
            toast.error("Please select a group first");
            return;
          }
          setShowAddUserDialog(true);
        }}
      >
        <UserPlus className="h-4 w-4" />
        Add User
      </button>
    </div>
  );
}
