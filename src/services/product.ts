import axios from "axios";

const Service = {
    createProduct: (formData: FormData, adminAuthToken: string) => {
        return axios.post(`http://localhost:4000/admin/create-product`, formData, {
            headers: {
                'Authorization': `Bearer ${adminAuthToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })
    },
    updateProduct: (productToEdit: any, formData: FormData, adminAuthToken: string) => {
        return axios.put(`http://localhost:4000/admin/update-product/${productToEdit._id}`, formData, {
            headers: {
                'Authorization': `Bearer ${adminAuthToken}`,
                'Content-Type': 'multipart/form-data',
            }
        })
    },
}

export default Service;