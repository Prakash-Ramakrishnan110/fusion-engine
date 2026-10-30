import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  isForced?: boolean;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  isForced = false,
}) => {
  const { changePassword, currentUser } = usePortal();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changePassword(newPassword);
      setIsLoading(false);
      if (res.success) {
        toast.success('Password updated successfully! Your account is secured.');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        toast.error(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Error updating password.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!isForced && !open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Lock className="w-4 h-4 text-primary" />
            {isForced ? 'Mandatory Password Change' : 'Update Your Password'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isForced ? (
              <span className="text-amber-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                This is your first login. For security compliance, please set a new personal password before proceeding.
              </span>
            ) : (
              'Set a new secure password for your portal account.'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="pr-10 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Confirm New Password</label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="text-xs"
              required
            />
          </div>

          <DialogFooter className="pt-2">
            {!isForced && (
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" disabled={isLoading} className="gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isLoading ? 'Updating...' : 'Set New Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
