
import { Checkbox } from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { User, UserRole } from "../types/user";

interface UserTableProps {
  users: User[];
  selectedGroup: string;
  loadingRoles: {[key: string]: UserRole[]};
  onRoleToggle: (email: string, role: UserRole, checked: boolean) => Promise<void>;
}

export function UserTable({ users, selectedGroup, loadingRoles, onRoleToggle }: UserTableProps) {
  const ALL_ROLES = Object.values(UserRole);

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

  const isRoleLoading = (email: string, role: UserRole) => {
    return loadingRoles[email]?.includes(role) || false;
  };

  if (!selectedGroup) {
    return (
      <div className="glass-panel p-8 text-center text-white/60">
        Please select a group to manage users
      </div>
    );
  }

  return (
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
          {users.map((user) => (
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
                        disabled={isRoleLoading(user.email, role)}
                        onCheckedChange={(checked) => 
                          onRoleToggle(user.email, role, checked as boolean)
                        }
                        className={`border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary ${
                          isRoleLoading(user.email, role) ? 'opacity-50 cursor-wait' : ''
                        }`}
                      />
                      <label
                        htmlFor={`${user.email}-${role}`}
                        className={`text-sm text-white/70 cursor-pointer hover:text-white ${
                          isRoleLoading(user.email, role) ? 'opacity-50' : ''
                        }`}
                      >
                        {role}
                        {isRoleLoading(user.email, role) && ' (Loading...)'}
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
  );
}
