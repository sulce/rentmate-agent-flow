import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColorPicker } from "@/components/ui/color-picker";
import { apiClient } from "@/lib/api/apiClient";
import { ImageUpload } from "@/components/ui/image-upload";

interface AgentSettings {
    brand_name: string;
    logo_url: string;
    brand_color: string;
    background_image_url: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    enable_notifications: boolean;
    notification_email: string;
}

const Settings = () => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<AgentSettings>({
        brand_name: "",
        logo_url: "",
        brand_color: "#000000",
        background_image_url: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        enable_notifications: true,
        notification_email: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await apiClient.getAgentSettings();
            setSettings(data);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load settings",
                variant: "destructive",
            });
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await apiClient.updateAgentSettings(settings);
            toast({
                title: "Success",
                description: "Settings updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update settings",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogoUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await apiClient.uploadLogo(formData);
            setSettings(prev => ({ ...prev, logo_url: response.logo_url }));
            toast({
                title: "Success",
                description: "Logo uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload logo",
                variant: "destructive",
            });
        }
    };

    const handleBackgroundUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await apiClient.uploadBackground(formData);
            setSettings(prev => ({ ...prev, background_image_url: response.background_url }));
            toast({
                title: "Success",
                description: "Background image uploaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload background",
                variant: "destructive",
            });
        }
    };

    return (
        <Layout>
            <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Agent Settings</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Customize your agent portal and notification preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                            <CardDescription>Customize your agent portal's appearance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Brand Name</Label>
                                <Input
                                    value={settings.brand_name}
                                    onChange={(e) => setSettings(prev => ({ ...prev, brand_name: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Logo</Label>
                                <ImageUpload
                                    currentImage={settings.logo_url}
                                    onUpload={handleLogoUpload}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Brand Color</Label>
                                <ColorPicker
                                    color={settings.brand_color}
                                    onChange={(color) => setSettings(prev => ({ ...prev, brand_color: color }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <ImageUpload
                                    currentImage={settings.background_image_url}
                                    onUpload={handleBackgroundUpload}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Update your business contact details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    value={settings.address}
                                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={settings.phone}
                                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={settings.email}
                                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input
                                    value={settings.website}
                                    onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receive notifications when documents are uploaded
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.enable_notifications}
                                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enable_notifications: checked }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Notification Email</Label>
                                <Input
                                    value={settings.notification_email}
                                    onChange={(e) => setSettings(prev => ({ ...prev, notification_email: e.target.value }))}
                                    placeholder="Optional: Different email for notifications"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default Settings; 