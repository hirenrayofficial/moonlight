import axios from "axios";

export const getItem = async () => {
  const res = await axios.get("/api/home/product");
  if (!res) {
    return;
  }
  //   console.log(res.data.item)
  return res.data.item;
};
export const getspcItem = async (slug) => {
  const res = await axios.post(`/api/home/product?slug=${slug}`);
  console.log(slug)
  if (!res) {
    return;
  }
  //   console.log(res.data.item)
  return res.data.item;
};
export const getRelatedItem = async (type) => {
  const res = await axios.post(`/api/home/productrelated?type=${type}`);
  console.log(type)
  if (!res) {
    return;
  }
  //   console.log(res.data.item)
  return res.data.item;
};
