
import { useState, useEffect } from "react";
import { UserRole, type User } from "./types/user";
import { AddUserDialog } from "./components/AddUserDialog";
import { UserManagementHeader } from "./components/UserManagementHeader";
import { UserTable } from "./components/UserTable";
import { toast } from "sonner";

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

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState<{[key: string]: UserRole[]}>({});

  useEffect(() => {
    setUserGroups(mockUserGroups);
    if (mockUserGroups.length > 0 && !selectedGroup) {
      setSelectedGroup(mockUserGroups[0]);
    }
  }, []);

  const filteredUsers = mockUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) && 
    user.groups.includes(selectedGroup)
  );

  const handleRoleToggle = async (email: string, role: UserRole, checked: boolean) => {
    if (!selectedGroup) {
      toast.error("Please select a group first");
      return;
    }

    setLoadingRoles(prev => ({
      ...prev,
      [email]: [...(prev[email] || []), role]
    }));

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve(true);
          } else {
            reject(new Error("Failed to update role"));
          }
        }, 1000);
      });

      console.log(`Updated ${role} for ${email} in group ${selectedGroup}: ${checked}`);
      toast.success(`${checked ? 'Added' : 'Removed'} ${role} role for ${email} in ${selectedGroup}`);
      
      const userToUpdate = mockUsers.find(u => u.email === email);
      if (userToUpdate) {
        if (checked) {
          userToUpdate.roles = [...userToUpdate.roles, role];
        } else {
          userToUpdate.roles = userToUpdate.roles.filter(r => r !== role);
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(`Failed to ${checked ? 'add' : 'remove'} ${role} role. Please try again.`);
    } finally {
      setLoadingRoles(prev => ({
        ...prev,
        [email]: (prev[email] || []).filter(r => r !== role)
      }));
    }
  };

  return (
    <div className="min-h-screen p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white/90">User Management</h1>
        
        <UserManagementHeader
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userGroups={userGroups}
          setShowAddUserDialog={setShowAddUserDialog}
        />

        <UserTable
          users={filteredUsers}
          selectedGroup={selectedGroup}
          loadingRoles={loadingRoles}
          onRoleToggle={handleRoleToggle}
        />
      </div>

      <AddUserDialog 
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        selectedGroup={selectedGroup}
      />
    </div>
  );
}
