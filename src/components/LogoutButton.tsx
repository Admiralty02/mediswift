'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const handleLogout = () => {
    console.log('Logging out...');
    // Add your actual logout logic here
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
      onClick={handleLogout}
    >
      <LogOut className="h-5 w-5" />
      <span>Log Out</span>
    </Button>
  );
}