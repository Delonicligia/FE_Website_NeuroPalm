export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export const getProducts = (): Product[] => {
  return [
    { id: 1, name: 'NeuroPalm Sensor Kit V1', price: 1500000, stock: 25 },
    { id: 2, name: 'NeuroPalm Gateway Hub', price: 2300000, stock: 12 },
    { id: 3, name: 'Soil Moisture Probe', price: 450000, stock: 50 },
  ];
};
