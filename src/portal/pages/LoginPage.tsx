import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  ShieldAlert,
  Code2,
  PhoneCall,
} from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isSupabaseLive } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  const [userIdOrEmail, setUserIdOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated and visiting /portal/login, redirect to dashboard or intended route
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/portal';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdOrEmail.trim() || !password.trim()) {
      toast.error('Please enter both User ID and Password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(userIdOrEmail, password);
      setIsLoading(false);
      if (res.success) {
        toast.success(`Authenticated successfully as ${userIdOrEmail.trim()}!`);
        if (res.mustChangePassword) {
          toast.warning('First-time login detected: Please update your temporary password.');
        }
        navigate('/portal', { replace: true });
      } else {
        toast.error(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err.message || 'Authentication error.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-gradient-to-br from-background via-muted/30 to-background antialiased relative selection:bg-primary/20 selection:text-primary">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center pb-1">
          <img
            src="/header-logo.png"
            alt="Fusion Engine Technology"
            className="h-11 w-auto mx-auto object-contain"
          />
        </div>

        {/* Login Card */}
        <Card className="border-border/60 bg-card/85 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Sign In to Your Workspace</CardTitle>
              <Badge variant="secondary" className="text-[10px] font-mono">
                {isSupabaseLive ? 'Enterprise Cloud' : 'Production RLS'}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Enter your enterprise User ID or registered email to authenticate.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>User ID or Email</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    value={userIdOrEmail}
                    onChange={(e) => setUserIdOrEmail(e.target.value)}
                    placeholder="Enter User ID (e.g. admin, dev_id)"
                    className="pl-9 text-xs font-mono"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Password</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-9 pr-9 text-xs"
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

              <Button type="submit" className="w-full text-xs h-9 shadow-md mt-2" disabled={isLoading}>
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Authenticate & Access Portal <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-0 flex flex-col items-center border-t border-border/40 py-3 bg-muted/20 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-500" />
              Row-Level Security enforced server-side via Supabase Auth
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
