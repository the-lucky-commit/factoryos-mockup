import { Customer } from '../lib/types';

export const mockCustomers: Customer[] = [
  {
    id: "CUST-001",
    companyName: "Pattana Electrical Engineering Co., Ltd.",
    contactPerson: "Somchai Deephrom",
    email: "somchai@pattana-eng.co.th",
    phone: "02-555-1234",
    address: "123/45 Vibhavadi Rangsit Rd, Chatuchak, Bangkok 10900",
    taxId: "0105561002345",
    creditTerm: "30 Days",
    totalOrders: 24,
    outstandingBalance: 345000.00
  },
  {
    id: "CUST-002",
    companyName: "Thai Grid Construction Partners",
    contactPerson: "Nattaporn Srisai",
    email: "procurement@thaigrid.com",
    phone: "081-888-9900",
    address: "88/1 Sukhumvit Soi 21, Khlong Toei Nua, Watthana, Bangkok 10110",
    taxId: "0105553018899",
    creditTerm: "60 Days",
    totalOrders: 42,
    outstandingBalance: 1250000.00
  },
  {
    id: "CUST-003",
    companyName: "Apex Cable & Wire Distributors",
    contactPerson: "John Doe",
    email: "sales@apexcable.net",
    phone: "034-420-111",
    address: "456 Moo 2, Bang Phli Yai, Bang Phli, Samut Prakan 10540",
    taxId: "0115549008761",
    creditTerm: "30 Days",
    totalOrders: 15,
    outstandingBalance: 0.00
  },
  {
    id: "CUST-004",
    companyName: "Grand Property Developer Group Plc.",
    contactPerson: "Kitti Rujirawan",
    email: "kitti.r@grandproperty.co.th",
    phone: "02-123-4567",
    address: "999 Rama IX Road, Huai Khwang, Bangkok 10310",
    taxId: "0107538000456",
    creditTerm: "45 Days",
    totalOrders: 8,
    outstandingBalance: 875200.00
  },
  {
    id: "CUST-005",
    companyName: "Mega Power Supply Systems",
    contactPerson: "Prasert Rakthai",
    email: "prasert@megapower.co.th",
    phone: "02-999-8888",
    address: "12/3 Moo 5, Lam Luk Ka Road, Lam Luk Ka, Pathum Thani 12150",
    taxId: "0135559001212",
    creditTerm: "Cash On Delivery",
    totalOrders: 19,
    outstandingBalance: 12500.00
  }
];
