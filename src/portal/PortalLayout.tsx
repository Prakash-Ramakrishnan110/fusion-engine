import React from 'react';
import { Outlet } from 'react-router-dom';
import { PortalHeader } from './components/PortalHeader';
import { PortalSidebar } from './components/PortalSidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PortalErrorBoundary } from './components/PortalErrorBoundary';

export const PortalLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
        <PortalHeader />
        <div className="flex-1 flex overflow-hidden min-h-0 w-full">
          <PortalSidebar />
          <main className="flex-1 h-full overflow-y-auto overflow-x-hidden min-h-0 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-background via-muted/10 to-background custom-scrollbar">
            <PortalErrorBoundary>
              <Outlet />
            </PortalErrorBoundary>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PortalLayout;

