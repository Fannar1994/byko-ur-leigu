
import { SearchResults, OffHireResponse, Contract, RentalItem } from "@/types/contract";

// Mock implementation for development and testing
export function mockSearchByKennitala(kennitala: string): Promise<SearchResults> {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API error for invalid format
      if (kennitala.length !== 10 || !/^\d+$/.test(kennitala)) {
        throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
      }

      // Simulate no results found
      if (kennitala === "0000000000") {
        throw new Error("Engir samningar fundust fyrir þessa kennitölu.");
      }

      // Generate contract ids and numbers based on kennitala to ensure consistency
      const contractId1 = `c1-${kennitala.substring(0, 4)}`;
      const contractId2 = `c2-${kennitala.substring(0, 4)}`;
      const contractNumber1 = `C-${kennitala.substring(0, 6)}`;
      const contractNumber2 = `C-${kennitala.substring(0, 4)}-B`;
      
      // Generate more varied mock data
      const contracts = generateMockContracts(kennitala);
      const rentalItems = generateMockRentalItems(kennitala, contracts);

      // Mock data for demonstration
      resolve({
        renter: {
          name: getRenterName(kennitala),
          kennitala
        },
        contracts: contracts,
        rentalItems: rentalItems
      });
    }, 1000);
  });
}

// Generate more varied mock contract data
function generateMockContracts(kennitala: string): Contract[] {
  const locations = ["Reykjavík", "Akureyri", "Selfoss", "Keflavík", "Hafnarfjörður", "Egilsstaðir"];
  const departments = ["KOPA", "GRAN", "SELF", "KEFL", "VER", "AKEY", "ÞORH"];
  
  // Use last digit to vary the number of contracts (1-3)
  const numContracts = (parseInt(kennitala.charAt(9)) % 3) + 1;
  
  const contracts: Contract[] = [];
  
  // Create active contract(s)
  for (let i = 0; i < numContracts; i++) {
    // Generate different start dates
    const startMonths = [1, 3, 6, 9];
    const startMonth = startMonths[i % startMonths.length];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - startMonth);
    
    // Generate different end dates
    const endMonths = [1, 2, 3, 6];
    const endMonth = endMonths[i % endMonths.length];
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + endMonth);
    
    const status = i === 0 ? "Virkur" : (Math.random() > 0.5 ? "Virkur" : "Lokið");
    
    contracts.push({
      id: `c${i+1}-${kennitala.substring(0, 4)}`,
      contractNumber: `C-${kennitala.substring(0, 4)}-${String.fromCharCode(65 + i)}`,
      status: status,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalValue: Math.floor(Math.random() * 200000) + 50000,
      location: locations[Math.floor(Math.random() * locations.length)],
      department: departments[Math.floor(Math.random() * departments.length)]
    });
  }
  
  return contracts;
}

// Generate more varied mock rental items
function generateMockRentalItems(kennitala: string, contracts: Contract[]): RentalItem[] {
  const items: RentalItem[] = [];
  const itemTypes = [
    // Heavy equipment
    { name: "Gröfuvél XL2000", category: "Þungar vinnuvélar", rate: 25000 },
    { name: "Hjólavél ZT450", category: "Þungar vinnuvélar", rate: 18000 },
    { name: "Lyftari 2T", category: "Þungar vinnuvélar", rate: 12000 },
    { name: "Byggingarkrani", category: "Þungar vinnuvélar", rate: 50000 },
    // Construction tools
    { name: "Steypuhrærivél", category: "Byggingartæki", rate: 8000 },
    { name: "Jarðvegsþjappa", category: "Byggingartæki", rate: 6500 },
    { name: "Múrbrot", category: "Byggingartæki", rate: 4500 },
    // Hand tools
    { name: "Rafmagnsborvél", category: "Handverkfæri", rate: 3000 },
    { name: "Slípivél", category: "Handverkfæri", rate: 2500 },
    { name: "Rafsuðuvél", category: "Handverkfæri", rate: 3500 },
    { name: "Naglabyssu sett", category: "Handverkfæri", rate: 2800 },
    // Safety equipment
    { name: "Öryggishjálmar (5 stk)", category: "Öryggisbúnaður", rate: 500 },
    { name: "Fallvarnarbúnaður", category: "Öryggisbúnaður", rate: 1500 },
    { name: "Vinnupallur 6m", category: "Öryggisbúnaður", rate: 8500 },
    // Interior
    { name: "Hillukerfi", category: "Innréttingar", rate: 15000 },
    { name: "Skrifstofueining", category: "Innréttingar", rate: 12000 },
  ];
  
  const statuses = ["Í leigu", "Tiltekt", "Úr leiga"];
  const departments = ["KOPA", "GRAN", "SELF", "KEFL", "VER", "AKEY", "ÞORH"];
  
  // Generate items for each contract
  contracts.forEach(contract => {
    // Number of items per contract (4-8)
    const numItems = Math.floor(Math.random() * 5) + 4;
    
    for (let i = 0; i < numItems; i++) {
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const status = contract.status === "Lokið" 
        ? "Úr leiga" 
        : statuses[Math.floor(Math.random() * (contract.status === "Virkur" ? 2 : 3))];
      
      const dueDate = new Date(contract.endDate);
      if (status === "Tiltekt") {
        // Make tiltekt items due sooner
        dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 10));
      }
      
      items.push({
        id: `i${i}-${contract.id}`,
        contractId: contract.id,
        itemName: itemType.name,
        category: itemType.category,
        serialNumber: `${itemType.category.charAt(0)}${itemType.name.charAt(0)}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        dueDate: dueDate.toISOString().split('T')[0],
        rentalRate: itemType.rate,
        status: status,
        department: departments[Math.floor(Math.random() * departments.length)]
      });
    }
  });
  
  return items;
}

// Generate a realistic Icelandic name based on kennitala
function getRenterName(kennitala: string): string {
  const firstNames = ["Jón", "Guðmundur", "Sigurður", "Gunnar", "Ólafur", "Kristján", 
                    "Árni", "Björn", "Stefán", "Einar", "Anna", "Kristín", 
                    "Margrét", "Guðrún", "Sigrún", "Helga", "Katrín", "María"];
  
  const lastNames = ["Jónsson", "Guðmundsson", "Sigurðsson", "Gunnarsson", "Ólafsson",
                    "Kristjánsson", "Árnason", "Björnsson", "Stefánsson", "Einarsson",
                    "Jónsdóttir", "Guðmundsdóttir", "Sigurðardóttir", "Gunnarsdóttir", 
                    "Ólafsdóttir", "Kristjánsdóttir", "Árnadóttir", "Björnsdóttir"];
  
  // Use digits from kennitala to select names (to ensure consistency)
  const firstNameIndex = parseInt(kennitala.substring(0, 2)) % firstNames.length;
  const lastNameIndex = parseInt(kennitala.substring(2, 4)) % lastNames.length;
  
  return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
}

// Mock implementation for off-hire
export async function mockOffHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`Mock off-hiring item ${itemId} with no charge: ${noCharge}`);
  
  return {
    success: true,
    message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
    itemId
  };
}
