import { useState, useEffect } from "react";
import { Search, UserPlus, ChevronDown } from "lucide-react";
import { UserRole, type User, type Group } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { AddUserDialog } from "@/components/AddUserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with actual API calls
const mockUsers: User[] = [
  {
    email: "aaron.smith@example.com",
    roles: [UserRole.Active],
    lastActive: "2022-06-30",
    groups: ["Engineering", "Product"]
  },
  {
    email: "sarah.j@example.com",
    roles: [UserRole.Admin, UserRole.UsersManager],
    lastActive: "2023-12-15",
    groups: ["Engineering"]
  },
];

const mockUserGroups = ["Engineering", "Product", "Design"];

const ALL_ROLES = Object.values(UserRole);

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);

  useEffect(() => {
    // Here you would fetch the user's groups from the API
    setUserGroups(mockUserGroups);
    // Set the first group as default when groups are loaded
    if (mockUserGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(mockUserGroups[0]);
    }
  }, []);

  const filteredUsers = mockUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) && 
    user.groups.includes(selectedGroup)
  );

  const handleRoleToggle = (email: string, role: UserRole, checked: boolean) => {
    if (!selectedGroup) {
      toast.error("Please select a group first");
      return;
    }
    // Here you would typically make an API call to update the user's roles
    console.log(`Toggling ${role} for ${email} in group ${selectedGroup}: ${checked}`);
    toast.success(`${checked ? 'Added' : 'Removed'} ${role} role for ${email} in ${selectedGroup}`);
  };

  const getRoleBadgeClass = (role: UserRole) => {
    const baseClass = "role-badge";
    switch (role) {
      case UserRole.Admin:
        return `${baseClass} role-badge-admin`;
      case UserRole.Active:
        return `${baseClass} role-badge-active`;
      case UserRole.Populate:
        return `${baseClass} role-badge-populate`;
      case UserRole.Write:
        return `${baseClass} role-badge-write`;
      case UserRole.ResolutionManager:
        return `${baseClass} role-badge-resolution`;
      case UserRole.UsersManager:
        return `${baseClass} role-badge-users`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="min-h-screen p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white/90">User Management</h1>
        
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

        {!selectedGroup ? (
          <div className="glass-panel p-8 text-center text-white/60">
            Please select a group to manage users
          </div>
        ) : (
          <div className="glass-panel overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-sm font-medium text-white/60">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Current Roles</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Assign Roles</th>
                  <th className="text-left p-4 text-sm font-medium text-white/60">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.email} className="table-row">
                    <td className="p-4 text-sm text-white/80">{user.email}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map(role => (
                          <span key={role} className={getRoleBadgeClass(role)}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-4">
                        {ALL_ROLES.map((role) => (
                          <div key={role} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${user.email}-${role}`}
                              checked={user.roles.includes(role)}
                              onCheckedChange={(checked) => 
                                handleRoleToggle(user.email, role, checked as boolean)
                              }
                              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <label
                              htmlFor={`${user.email}-${role}`}
                              className="text-sm text-white/70 cursor-pointer hover:text-white"
                            >
                              {role}
                            </label>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-white/60">
                      {new Date(user.lastActive!).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddUserDialog 
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        selectedGroup={selectedGroup}
      />
    </div>
  );
}
