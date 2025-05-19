import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  Clock,
  Download,
  LayoutDashboard,
  MailOpen,
  Send,
  Settings,
  Users,
} from "lucide-react";

// Sample data for demonstration purposes
// In a real implementation, this would come from your backend API
const sampleCampaignData = [
  {
    id: 1,
    name: "End of School Year Memories",
    creator: "Sarah Johnson",
    activeContributors: 26,
    totalContributors: 35,
    messagesCollected: 42,
    status: "Active",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    sentCount: 1,
    openCount: 1,
    downloadCount: 0,
    averageOpenTime: "2.5 hours",
  },
  {
    id: 2,
    name: "Championship Basketball Team",
    creator: "Coach Wilson",
    activeContributors: 12,
    totalContributors: 15,
    messagesCollected: 18,
    status: "Active",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    sentCount: 0,
    openCount: 0,
    downloadCount: 0,
    averageOpenTime: "N/A",
  },
  {
    id: 3,
    name: "Retirement Wishes for Jim",
    creator: "HR Department",
    activeContributors: 42,
    totalContributors: 50,
    messagesCollected: 47,
    status: "Completed",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    sentCount: 3,
    openCount: 3,
    downloadCount: 2,
    averageOpenTime: "1.2 hours",
  },
  {
    id: 4,
    name: "Wedding Congratulations",
    creator: "Emily Chen",
    activeContributors: 31,
    totalContributors: 40,
    messagesCollected: 38,
    status: "Completed",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    sentCount: 2,
    openCount: 2,
    downloadCount: 2,
    averageOpenTime: "0.5 hours",
  },
  {
    id: 5,
    name: "Baby Shower Messages",
    creator: "Jessica Smith",
    activeContributors: 18,
    totalContributors: 25,
    messagesCollected: 22,
    status: "Active",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    sentCount: 0,
    openCount: 0,
    downloadCount: 0,
    averageOpenTime: "N/A",
  },
];

// Weekly campaign creation data for charts
const weeklyData = [
  { name: "Week 1", campaigns: 2, messages: 15 },
  { name: "Week 2", campaigns: 5, messages: 42 },
  { name: "Week 3", campaigns: 3, messages: 28 },
  { name: "Week 4", campaigns: 7, messages: 65 },
];

// Distribution data for pie charts
const statusDistribution = [
  { name: "Active", value: 3 },
  { name: "Completed", value: 2 },
];

const engagementDistribution = [
  { name: "Sent", value: 6 },
  { name: "Opened", value: 6 },
  { name: "Downloaded", value: 4 },
];

// Color configurations
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const STATUS_COLORS = {
  Active: "#10B981",
  Completed: "#6366F1",
};

const AdminPanel = () => {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState(sampleCampaignData);

  // In a real implementation, you would check if the user is authenticated via a backend API
  // Here, we're just using a simple condition for demo purposes
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials for demo
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password");
    }
  };

  // Filter campaigns based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = sampleCampaignData.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCampaigns(filtered);
    } else {
      setFilteredCampaigns(sampleCampaignData);
    }
  }, [searchTerm]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days remaining or elapsed
  const calculateDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} days remaining`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  };

  // Calculate campaign duration
  const calculateDuration = (startDate: Date, endDate: Date) => {
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  // Summary statistics
  const activeCampaigns = sampleCampaignData.filter(c => c.status === "Active").length;
  const totalMessages = sampleCampaignData.reduce((sum, campaign) => sum + campaign.messagesCollected, 0);
  const totalContributors = sampleCampaignData.reduce((sum, campaign) => sum + campaign.activeContributors, 0);
  const totalSent = sampleCampaignData.reduce((sum, campaign) => sum + campaign.sentCount, 0);
  const totalOpened = sampleCampaignData.reduce((sum, campaign) => sum + campaign.openCount, 0);
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-[350px] shadow-lg">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md hidden md:block p-4 h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-1">FlipWish</h2>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
          <nav className="space-y-1">
            <a href="#dashboard" className="flex items-center px-4 py-3 text-sm bg-primary/10 text-primary rounded-md font-medium">
              <LayoutDashboard className="h-4 w-4 mr-3" />
              Dashboard
            </a>
            <a href="#campaigns" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <Calendar className="h-4 w-4 mr-3" />
              Campaigns
            </a>
            <a href="#analytics" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <BarChart3 className="h-4 w-4 mr-3" />
              Analytics
            </a>
            <a href="#settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </a>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-primary">FlipWish Admin</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome, Admin</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </header>

          {/* Dashboard content */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Active Campaigns</p>
                      <h3 className="text-2xl font-bold">{activeCampaigns}</h3>
                    </div>
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Messages</p>
                      <h3 className="text-2xl font-bold">{totalMessages}</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Active Contributors</p>
                      <h3 className="text-2xl font-bold">{totalContributors}</h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Open Rate</p>
                      <h3 className="text-2xl font-bold">{openRate}%</h3>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <MailOpen className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="campaigns" className="space-y-4">
              <TabsList>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              {/* Campaigns Tab */}
              <TabsContent value="campaigns" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Active Campaigns</h2>
                  <Input
                    placeholder="Search campaigns..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign Name</TableHead>
                          <TableHead>Creator</TableHead>
                          <TableHead>Contributors</TableHead>
                          <TableHead>Messages</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Duration</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCampaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>{campaign.creator}</TableCell>
                            <TableCell>{campaign.activeContributors}/{campaign.totalContributors}</TableCell>
                            <TableCell>{campaign.messagesCollected}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  campaign.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {campaign.status}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatDate(campaign.deadline)}</span>
                                <span className="text-xs text-gray-500">{calculateDaysRemaining(campaign.deadline)}</span>
                              </div>
                            </TableCell>
                            <TableCell>{calculateDuration(campaign.createdAt, campaign.deadline)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Engagement Tab */}
              <TabsContent value="engagement" className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Engagement Metrics</h2>
                
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign Name</TableHead>
                          <TableHead>Sent Count</TableHead>
                          <TableHead>Open Count</TableHead>
                          <TableHead>Download Count</TableHead>
                          <TableHead>Open Rate</TableHead>
                          <TableHead>Avg. Open Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCampaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Send className="h-4 w-4 mr-2 text-gray-400" />
                                {campaign.sentCount}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MailOpen className="h-4 w-4 mr-2 text-gray-400" />
                                {campaign.openCount}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Download className="h-4 w-4 mr-2 text-gray-400" />
                                {campaign.downloadCount}
                              </div>
                            </TableCell>
                            <TableCell>
                              {campaign.sentCount > 0
                                ? `${Math.round((campaign.openCount / campaign.sentCount) * 100)}%`
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                {campaign.averageOpenTime}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={engagementDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {engagementDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Growth Analytics</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Campaign Creation & Message Collection</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="campaigns" fill="#10B981" name="Campaigns Created" />
                        <Bar dataKey="messages" fill="#6366F1" name="Messages Collected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Campaign Duration</CardTitle>
                      <CardDescription>Average time campaigns remain active</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-5xl font-bold text-primary">14.5</p>
                        <p className="text-gray-500 mt-2">days</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Open Time</CardTitle>
                      <CardDescription>Average time before recipients open their flipbook</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-5xl font-bold text-primary">1.4</p>
                        <p className="text-gray-500 mt-2">hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;