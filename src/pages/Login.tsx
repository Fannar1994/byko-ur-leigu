
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../App";
import { loginToInspHire } from "../api/inspHireService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mockUsername, setMockUsername] = useState("demo");
  const [mockPassword, setMockPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const sessionData = await loginToInspHire(username, password);
      
      // Save the entire session data for future API requests
      localStorage.setItem("inspSession", sessionData.sessionId);
      localStorage.setItem("inspDepot", sessionData.depot);
      localStorage.setItem("inspUsername", sessionData.username);
      
      setIsAuthenticated(true);
      toast.success("Innskráning tókst", {
        description: "Velkomin/n aftur!",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Innskráning mistókst", {
        description: error instanceof Error ? error.message : "Villa kom upp við innskráningu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation for the mock login
    if (mockUsername === "demo" && mockPassword === "demo123") {
      // Create a mock session
      localStorage.setItem("inspSession", "mock-session-id");
      localStorage.setItem("inspDepot", "mock-depot");
      localStorage.setItem("inspUsername", mockUsername);
      
      // Short delay to simulate API call
      setTimeout(() => {
        setIsAuthenticated(true);
        toast.success("Demo innskráning tókst", {
          description: "Þú ert skráð/ur inn með demo aðgang!",
        });
        navigate("/");
        setIsLoading(false);
      }, 800);
    } else {
      setTimeout(() => {
        toast.error("Demo innskráning mistókst", {
          description: "Notandanafn: demo, Lykilorð: demo123",
        });
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/3e1840af-2d2e-403d-81ae-e4201bb075c5.png" 
              alt="BYKO LEIGA" 
              className="h-32 w-auto mb-6 mx-auto" 
            />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">Innskráning</h2>
              <p className="text-white mt-2">Skráðu þig inn á þinn aðgang</p>
            </div>
          </div>
          
          <Tabs defaultValue="mock" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="mock">Demo Innskráning</TabsTrigger>
              <TabsTrigger value="real">API Innskráning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mock">
              <Card className="p-6">
                <form onSubmit={handleMockLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mockUsername" className="text-white">Demo Notandanafn</Label>
                    <Input 
                      id="mockUsername"
                      type="text" 
                      placeholder="demo"
                      value={mockUsername}
                      onChange={(e) => setMockUsername(e.target.value)}
                      required
                      className="text-white placeholder-white/70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mockPassword" className="text-white">Demo Lykilorð</Label>
                    <Input 
                      id="mockPassword"
                      type="password" 
                      placeholder="demo123"
                      value={mockPassword}
                      onChange={(e) => setMockPassword(e.target.value)}
                      required
                      className="text-white placeholder-white/70"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                        Skrái inn...
                      </>
                    ) : "Innskrá með demo"}
                  </Button>
                  
                  <p className="text-sm text-white/70 text-center mt-4">
                    Demo aðgangur: <span className="font-medium">demo / demo123</span>
                  </p>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="real">
              <Card className="p-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Notandanafn</Label>
                    <Input 
                      id="username"
                      type="text" 
                      placeholder="Sláðu inn notandanafn"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="text-white placeholder-white/70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Lykilorð</Label>
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="Sláðu inn lykilorð"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-white placeholder-white/70"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
                        Skrái inn...
                      </>
                    ) : "Innskrá"}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-[#2A2A2A] text-white py-4 px-4">
        <div className="container mx-auto text-center text-sm">
          <p>BYKO Leiga</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
