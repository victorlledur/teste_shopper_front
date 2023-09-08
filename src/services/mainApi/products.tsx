import baseApi from "./config";

export function listProducts(){
    return baseApi.get('/products')
}

export function byIdProduct(props: any) {
  return baseApi.get(`/product/${props}`);
}

export async function updateProduct(req: any, props: any) {
  const response = await baseApi.put(`/product/${props}`, {
    sales_price: req.sales_price,    
  });
  return response.data;
}