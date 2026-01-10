import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Mail, Lock, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/shared/hooks';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (user) { navigate('/dashboard'); return null; }

  const validateForm = () => {
    try { emailSchema.parse(email); passwordSchema.parse(password); return true; }
    catch (err) { if (err instanceof z.ZodError) setError(err.errors[0].message); return false; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) setError(error.message.includes('already registered') ? 'This email is already registered.' : error.message);
        else { toast({ title: 'Account created!', description: 'Welcome to Afya Band.' }); navigate('/dashboard'); }
      } else {
        const { error } = await signIn(email, password);
        if (error) setError(error.message.includes('Invalid login') ? 'Invalid email or password.' : error.message);
        else { toast({ title: 'Welcome back!' }); navigate('/dashboard'); }
      }
    } catch { setError('An unexpected error occurred.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      <header className="p-4 sm:p-6"><Link to="/" className="inline-flex items-center gap-2 text-primary-foreground hover:opacity-80"><ArrowLeft className="w-5 h-5" /><span>Back to Home</span></Link></header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center"><Activity className="text-primary-foreground w-7 h-7" /></div>
              <span className="text-3xl font-bold text-primary-foreground">Afya Band</span>
            </div>
            <p className="text-primary-foreground/80">{isSignUp ? 'Create your account' : 'Sign in to access your health data'}</p>
          </div>
          <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 text-center">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2"><AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" /><p className="text-sm text-destructive">{error}</p></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" /></div></div>}
              <div className="space-y-2"><Label htmlFor="email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required /></div></div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} /></div></div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}</Button>
            </form>
            <div className="mt-6 text-center"><button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); }} className="text-primary hover:underline text-sm">{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</button></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;
