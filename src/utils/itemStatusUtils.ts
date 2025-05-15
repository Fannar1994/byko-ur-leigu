
export const getItemStatusColor = (status?: string) => {
  switch (status) {
    case "On Rent": 
    case "Í leigu": return "bg-primary text-primary-foreground"; 
    case "Off-Hired":
    case "Úr leiga": return "bg-red-100 text-red-800";
    case "Pending Return": 
    case "Tiltekt": return "bg-yellow-200 text-yellow-800 border border-yellow-400"; // Enhanced to make more noticeable
    case "Tilbúið til afhendingar": return "bg-green-500 text-black"; 
    default: return "bg-gray-100 text-gray-800";
  }
};

export const getDepartmentBadgeColor = (department?: string) => {
  switch (department) {
    case "KOPA": return "bg-blue-100 text-blue-800";
    case "ÞORH": return "bg-green-100 text-green-800";
    case "GRAN": return "bg-purple-100 text-purple-800";
    case "KEFL": return "bg-orange-100 text-orange-800";
    case "SELF": return "bg-pink-100 text-pink-800";
    case "AKEY": return "bg-indigo-100 text-indigo-800";
    case "VER": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
