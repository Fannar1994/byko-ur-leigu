
import { toast } from "sonner";

// Configuration for the SQL connection
interface SQLConfig {
  server: string;
  database: string;
  user: string;
  password: string;
  port?: number;
}

// Default configuration - replace with your actual values
const defaultConfig: SQLConfig = {
  server: "localhost", // Replace with your server
  database: "database", // Replace with your database name
  user: "username",     // Replace with your username
  password: "password", // Replace with your password
  port: 1433            // Default SQL Server port
};

// Class to handle SQL connections
export class SQLConnection {
  private config: SQLConfig;
  private connected: boolean = false;
  
  constructor(config: SQLConfig = defaultConfig) {
    this.config = config;
  }
  
  // Initialize the connection
  async connect(): Promise<boolean> {
    try {
      console.log("Connecting to SQL database...");
      
      // This is a placeholder for the actual connection logic
      // In a real implementation, you would use a library like 'mssql', 'mysql2', etc.
      
      // For InspHire API connection, you might use fetch or axios instead
      // Example: const response = await fetch('http://172.18.69.125:8080/insphire.officeTest/api/endpoint');
      
      // Simulate successful connection
      this.connected = true;
      toast.success("Tenging við gagnagrunn tókst!");
      return true;
    } catch (error) {
      console.error("SQL connection error:", error);
      toast.error("Villa við tengingu við gagnagrunn", {
        description: error instanceof Error ? error.message : "Óþekkt villa",
      });
      return false;
    }
  }
  
  // Execute a query - placeholder for actual implementation
  async query(sql: string, params: any[] = []): Promise<any> {
    if (!this.connected) {
      await this.connect();
    }
    
    try {
      console.log(`Executing query: ${sql} with params:`, params);
      
      // Placeholder for actual query execution
      // In a real implementation, this would interact with your database
      
      // For InspHire API, you would make appropriate HTTP requests
      // Example: 
      // const response = await fetch('http://172.18.69.125:8080/insphire.officeTest/api/data', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query: sql, parameters: params })
      // });
      // return await response.json();
      
      return { success: true, data: [] };
    } catch (error) {
      console.error("Query execution error:", error);
      toast.error("Villa við keyrslu fyrirspurnar", {
        description: error instanceof Error ? error.message : "Óþekkt villa",
      });
      throw error;
    }
  }
  
  // Close the connection
  async disconnect(): Promise<void> {
    if (this.connected) {
      console.log("Disconnecting from SQL database...");
      // Cleanup code would go here
      this.connected = false;
    }
  }
}

// Export a singleton instance for use throughout the application
export const sqlConnection = new SQLConnection();

// Helper function to connect to InspHire API
export async function connectToInspHireAPI(endpoint: string, method: string = 'GET', body?: any) {
  try {
    const baseUrl = 'http://172.18.69.125:8080/insphire.officeTest/';
    const url = `${baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    };
    
    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("InspHire API error:", error);
    toast.error("Villa við tengingu við InspHire API", {
      description: error instanceof Error ? error.message : "Óþekkt villa",
    });
    throw error;
  }
}
