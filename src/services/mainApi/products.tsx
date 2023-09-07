import baseApi from "./config";

export function listProducts(){
    return baseApi.get('/products')
}

export function byIdProduct(props: any) {
  return baseApi.get(`/product/${props}`);
}

export function updateProduct(req: any, props: any) {
  return baseApi.put(`/user/${props}`, {
    sales_price: req.sales_price,
  });
}