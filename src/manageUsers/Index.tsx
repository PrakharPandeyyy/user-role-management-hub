
import { useState, useEffect } from "react";
import { MantineProvider, Container, Title, Group, Select, TextInput, Button, Paper, Table, Checkbox, Stack } from '@mantine/core';
import { IconSearch, IconUserPlus } from '@tabler/icons-react';
import { toast } from "sonner";
import { UserRole, type User } from "./types/user";
import { AddUserDialog } from "./components/AddUserDialog";
import './styles/manageUsers.css';

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
    <MantineProvider>
      <div className="user-management">
        <Container size="xl" className="user-management-container">
          <Stack gap="xl">
            <Title order={1} className="header-title">User Management</Title>
            
            <Group justify="space-between">
              <Group gap="md" style={{ flex: 1 }}>
                <Select
                  placeholder="Select group"
                  data={userGroups}
                  value={selectedGroup}
                  onChange={(value) => setSelectedGroup(value || '')}
                  style={{ width: 200 }}
                />
                
                <TextInput
                  placeholder="Search by email"
                  leftSection={<IconSearch size={16} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ flex: 1 }}
                />
              </Group>
              
              <Button
                onClick={() => {
                  if (!selectedGroup) {
                    toast.error("Please select a group first");
                    return;
                  }
                  setShowAddUserDialog(true);
                }}
              >
                <Group gap={4}>
                  <IconUserPlus size={16} />
                  <span>Add User</span>
                </Group>
              </Button>
            </Group>

            {!selectedGroup ? (
              <Paper p="xl" ta="center" c="dimmed">
                Please select a group to manage users
              </Paper>
            ) : (
              <Paper>
                <Table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Current Roles</th>
                      <th>Assign Roles</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>
                          <div className="roles-container">
                            {user.roles.map(role => (
                              <span key={role} className={`role-badge role-badge-${role.toLowerCase()}`}>
                                {role}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="roles-container">
                            {Object.values(UserRole).map((role) => (
                              <Group key={role} gap="xs">
                                <Checkbox
                                  id={`${user.email}-${role}`}
                                  checked={user.roles.includes(role)}
                                  disabled={loadingRoles[user.email]?.includes(role)}
                                  onChange={(event) => 
                                    handleRoleToggle(user.email, role, event.currentTarget.checked)
                                  }
                                  label={`${role}${loadingRoles[user.email]?.includes(role) ? ' (Loading...)' : ''}`}
                                />
                              </Group>
                            ))}
                          </div>
                        </td>
                        <td>{new Date(user.lastActive!).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Paper>
            )}
          </Stack>
        </Container>
      </div>

      <AddUserDialog 
        open={showAddUserDialog}
        onOpenChange={setShowAddUserDialog}
        selectedGroup={selectedGroup}
      />
    </MantineProvider>
  );
}
