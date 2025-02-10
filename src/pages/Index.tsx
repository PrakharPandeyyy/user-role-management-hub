
import { useState } from "react";
import { Search, UserPlus, ChevronDown } from "lucide-react";
import { UserRole, type User } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const mockUsers: User[] = [
  {
    email: "aaron.smith@example.com",
    roles: [UserRole.Active],
    lastActive: "2022-06-30",
  },
  {
    email: "sarah.j@example.com",
    roles: [UserRole.Admin, UserRole.UsersManager],
    lastActive: "2023-12-15",
  },
];

const ALL_ROLES = Object.values(UserRole);

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = mockUsers.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleToggle = (email: string, role: UserRole, checked: boolean) => {
    // Here you would typically make an API call to update the user's roles
    console.log(`Toggling ${role} for ${email}: ${checked}`);
    toast.success(`${checked ? 'Added' : 'Removed'} ${role} role for ${email}`);
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
            <div className="relative w-48">
              <button className="glass-panel w-full px-4 py-2 text-sm flex items-center justify-between text-white/80 hover:text-white transition-colors">
                {selectedGroup}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </div>
            
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
          
          <button className="glass-panel px-4 py-2 text-sm font-medium text-white/90 hover:text-white flex items-center gap-2 hover:bg-white/5 transition-colors">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>

        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm font-medium text-white/60">Email</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Type</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Assign Roles</th>
                <th className="text-left p-4 text-sm font-medium text-white/60">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
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
      </div>
    </div>
  );
}
