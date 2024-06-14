import axios from "axios";
import { axiosJWT } from "./UserService";

const API_URL = process.env.REACT_APP_API_URL;

// Function to create a new discount
export const createDiscount = async (data, access_token) => {
    const res = await axiosJWT.post(`${API_URL}/discount/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

// Function to get a discount by code
export const getDiscountByCode = async (code) => {
    const res = await axios.get(`${API_URL}/discount/code/${code}`);
    return res.data;
};

// Function to get all discounts with optional search and pagination
export const getAllDiscounts = async (search = '', limit = 10, page = 1) => {
    let res;
    if (search.length > 0) {
        res = await axios.get(`${API_URL}/discount/get-all?filter=code&search=${search}&limit=${limit}&page=${page}`);
    } else {
        res = await axios.get(`${API_URL}/discount/get-all?limit=${limit}&page=${page}`);
    }
    return res.data;
};

// Function to update a discount
export const updateDiscount = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${API_URL}/discount/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

// Function to delete a discount
export const deleteDiscount = async (id, access_token) => {
    const res = await axiosJWT.delete(`${API_URL}/discount/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

// Function to delete multiple discounts
export const deleteManyDiscounts = async (ids, access_token) => {
    const res = await axiosJWT.post(`${API_URL}/discount/delete-many`, { ids }, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};
