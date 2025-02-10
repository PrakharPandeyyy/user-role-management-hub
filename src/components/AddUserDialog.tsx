
import { useState } from "react";
import { X } from "lucide-react";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGroup: string;
}

export function AddUserDialog({ open, onOpenChange, selectedGroup }: AddUserDialogProps) {
  const [email, setEmail] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }
    // Here you would make an API call to add the user
    console.log("Adding user:", { email, roles: selectedRoles, group: selectedGroup });
    toast.success(`User ${email} added to ${selectedGroup}`);
    setEmail("");
    setSelectedRoles([]);
    onOpenChange(false);
  };

  const handleRoleToggle = (role: UserRole, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white/90">Add User to {selectedGroup}</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-white/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-panel px-3 py-2 text-sm text-white/80 placeholder:text-white/40"
              placeholder="user@example.com"
              required
            />
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70">
              Select Roles
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(UserRole).map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role}`}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) => 
                      handleRoleToggle(role, checked as boolean)
                    }
                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label
                    htmlFor={`role-${role}`}
                    className="text-sm text-white/70 cursor-pointer hover:text-white"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="glass-panel hover:bg-white/10"
            >
              Add User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
