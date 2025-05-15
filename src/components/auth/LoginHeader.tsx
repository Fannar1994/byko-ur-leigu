
import React from "react";

const LoginHeader = () => {
  return (
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
  );
};

export default LoginHeader;
