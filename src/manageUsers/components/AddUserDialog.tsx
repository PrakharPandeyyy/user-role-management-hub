
import { useState } from "react";
import { Modal, TextInput, Stack, Group, Button, Checkbox, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { UserRole } from "../types/user";
import { toast } from "sonner";

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
    <Modal
      opened={open}
      onClose={() => onOpenChange(false)}
      title={<Title order={3}>Add User to {selectedGroup}</Title>}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Stack gap="xs">
            <Title order={6}>Select Roles</Title>
            {Object.values(UserRole).map((role) => (
              <Checkbox
                key={role}
                label={role}
                checked={selectedRoles.includes(role)}
                onChange={(event) => 
                  handleRoleToggle(role, event.currentTarget.checked)
                }
              />
            ))}
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button type="submit">
              Add User
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
