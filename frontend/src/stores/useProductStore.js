import { create } from "zustand"
import toast from "react-hot-toast"
import axios from "../lib/axios"


export const useProductStore = create((set) => ({
  products: [],
  loading: false,


  setProducts: (products) => set([products]),

  createProduct: async (productData) => {
    set({ loading: true })
    try {
      const res = await axios.post("/products", productData)
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false
      }))
    } catch (error) {
      toast.error("Error creating product")
      set({ loading: false })
    }
  }
}))