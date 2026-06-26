export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const getUsers = (): User[] => {
  return [
    { id: 1, name: 'Budi Santoso', email: 'budi@neuropalm.com', role: 'Super Admin' },
    { id: 2, name: 'Siti Rahma', email: 'siti@neuropalm.com', role: 'Editor' },
    { id: 3, name: 'Andi Wijaya', email: 'andi@neuropalm.com', role: 'Viewer' },
  ];
};
