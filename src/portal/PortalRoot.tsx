import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortalProvider } from './context/PortalContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { SupabaseSetupError } from './components/SupabaseSetupError';

export const PortalRoot: React.FC = () => {
  // Requirement A1: If Supabase env vars are missing, show clear setup-error screen (no sandbox fallback)
  if (!isSupabaseConfigured()) {
    return <SupabaseSetupError />;
  }

  return (
    <PortalProvider>
      <Outlet />
    </PortalProvider>
  );
};

export default PortalRoot;
