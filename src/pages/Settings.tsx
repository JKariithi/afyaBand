import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, User, Bell, Download, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifyAbnormal, setNotifyAbnormal] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (data) setFullName(data.full_name || '');
    };
    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
    toast(error ? { title: 'Error', description: 'Failed to update profile.', variant: 'destructive' } : { title: 'Profile updated' });
    setLoading(false);
  };

  const handleExportData = async () => {
    if (!user) return;
    const { data: readings } = await supabase.from('health_readings').select('*').eq('user_id', user.id).order('recorded_at', { ascending: false });
    const csvContent = ['Date,Time,Heart Rate,Systolic,Diastolic', ...(readings || []).map(r => { const d = new Date(r.recorded_at); return `${d.toLocaleDateString()},${d.toLocaleTimeString()},${r.heart_rate},${r.systolic},${r.diastolic}`; })].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `afya-band-data-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    toast({ title: 'Export complete', description: `Downloaded ${readings?.length || 0} readings.` });
  };

  const handleDeleteAllData = async () => {
    if (!user || !window.confirm('Delete all health data? This cannot be undone.')) return;
    const { error } = await supabase.from('health_readings').delete().eq('user_id', user.id);
    toast(error ? { title: 'Error', variant: 'destructive' } : { title: 'Data deleted' });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border"><div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}><ArrowLeft className="w-5 h-5" /></Button><div className="flex items-center gap-3"><div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><Activity className="text-primary-foreground w-5 h-5" /></div><h1 className="text-xl font-bold text-card-foreground">Settings</h1></div></div></header>
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Profile</CardTitle><CardDescription>Manage your account</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Email</Label><Input value={user?.email || ''} disabled className="bg-muted" /></div><div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" /></div><Button onClick={handleSaveProfile} disabled={loading}><Save className="w-4 h-4 mr-2" />{loading ? 'Saving...' : 'Save'}</Button></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><p className="font-medium">Abnormal Vitals Alert</p><p className="text-sm text-muted-foreground">Get notified when readings are outside normal range</p></div><Switch checked={notifyAbnormal} onCheckedChange={setNotifyAbnormal} /></div><Separator /><div className="flex items-center justify-between"><div><p className="font-medium">Weekly Summary</p><p className="text-sm text-muted-foreground">Receive weekly health report</p></div><Switch checked={notifyWeekly} onCheckedChange={setNotifyWeekly} /></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Download className="w-5 h-5" />Data Management</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex flex-col sm:flex-row gap-3"><Button variant="outline" onClick={handleExportData}><Download className="w-4 h-4 mr-2" />Export (CSV)</Button><Button variant="destructive" onClick={handleDeleteAllData}><Trash2 className="w-4 h-4 mr-2" />Delete All Data</Button></div></CardContent></Card>
      </main>
    </div>
  );
};

export default Settings;
