import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, User, Bell, Download, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notifyAbnormal, setNotifyAbnormal] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setFullName(data.full_name || '');
      }
    };
    
    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
    }
    
    setLoading(false);
  };

  const handleExportData = async () => {
    if (!user) return;
    
    toast({
      title: 'Exporting data...',
      description: 'Preparing your health data for download.',
    });
    
    const { data: readings, error } = await supabase
      .from('health_readings')
      .select('*')
      .eq('user_id', user.id)
      .order('recorded_at', { ascending: false });
    
    if (error) {
      toast({
        title: 'Export failed',
        description: 'Could not retrieve your data.',
        variant: 'destructive',
      });
      return;
    }
    
    const csvContent = [
      'Date,Time,Heart Rate (BPM),Systolic (mmHg),Diastolic (mmHg)',
      ...(readings || []).map(r => {
        const date = new Date(r.recorded_at);
        return `${date.toLocaleDateString()},${date.toLocaleTimeString()},${r.heart_rate},${r.systolic},${r.diastolic}`;
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afya-band-health-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export complete',
      description: `Downloaded ${readings?.length || 0} health readings.`,
    });
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete all your health data? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    const { error } = await supabase
      .from('health_readings')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete data.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Data deleted',
        description: 'All your health readings have been removed.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-primary-foreground w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-card-foreground">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <Button onClick={handleSaveProfile} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Abnormal Vitals Alert</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when readings are outside normal range
                </p>
              </div>
              <Switch
                checked={notifyAbnormal}
                onCheckedChange={setNotifyAbnormal}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive a weekly health summary report
                </p>
              </div>
              <Switch
                checked={notifyWeekly}
                onCheckedChange={setNotifyWeekly}
              />
            </div>
            <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              Email notifications require additional setup. Contact support to enable.
            </p>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>Export or delete your health data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export All Data (CSV)
              </Button>
              <Button variant="destructive" onClick={handleDeleteAllData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Data
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Exported data includes all your health readings in CSV format.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
