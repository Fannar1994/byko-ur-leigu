
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../../App";
import { loginToInspHire } from "../../api/inspHireService";
import { Card } from "@/components/ui/card";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  return (
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
  );
};

export default LoginForm;
