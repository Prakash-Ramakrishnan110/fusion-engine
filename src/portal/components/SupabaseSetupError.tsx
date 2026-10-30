import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Database, KeyRound, ExternalLink, ShieldCheck, Terminal, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const SupabaseSetupError: React.FC = () => {
  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(
      `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
    );
    toast.success('Copied .env template to clipboard!');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-background via-muted/40 to-background antialiased relative">
      <div className="w-full max-w-xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 shadow-xl mb-1">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Supabase Backend Connection Required
          </h1>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            The multi-project ERP & CRM system enforces server-side Row-Level Security (RLS) and real-time locking. Local browser sandbox mode has been disabled for production compliance.
          </p>
        </div>

        <Card className="border-border/80 bg-card/90 backdrop-blur-md shadow-2xl">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Missing Environment Credentials
              </CardTitle>
              <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                Setup Required
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Configure your Supabase Project URL and Anon API Key in the root <code className="text-primary font-mono font-semibold">.env</code> file.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4 text-xs">
            <div className="space-y-2">
              <span className="font-semibold text-foreground flex items-center justify-between">
                <span>1. Add variables to <code className="font-mono">.env</code></span>
                <Button variant="ghost" size="sm" onClick={copyEnvSnippet} className="h-6 text-[11px] gap-1 px-2">
                  <Copy className="w-3 h-3" /> Copy Snippet
                </Button>
              </span>
              <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-border/40">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`}
              </pre>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-foreground">2. Execute Database Migrations</span>
              <p className="text-muted-foreground text-[11px]">
                In your Supabase Dashboard SQL Editor, run the following migration scripts in order:
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded bg-muted/40 border border-border/40">
                  📄 supabase/migrations/001_init.sql
                </div>
                <div className="p-2 rounded bg-muted/40 border border-border/40">
                  📄 supabase/migrations/002_enterprise_expansion.sql
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-foreground">3. Provision Initial Super Admin</span>
              <p className="text-muted-foreground text-[11px]">
                Create an authentication user with email <code className="font-mono text-primary">admin@portal.internal</code> in Supabase Auth, then run <code className="font-mono">supabase/seed.sql</code>.
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-3 border-t border-border/40 flex items-center justify-between bg-muted/20">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Server-enforced RLS & append-only audit
            </span>
            <Button size="sm" asChild variant="outline" className="text-xs h-8 gap-1">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                Supabase Dashboard <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SupabaseSetupError;
