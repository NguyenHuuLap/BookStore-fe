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
    const res = await axios.get(`${API_URL}/discount/${code}`);
    return res.data;
};

// Function to get all discounts
export const getAllDiscounts = async () => {
    const res = await axios.get(`${API_URL}/discount`);
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
    const res = await axiosJWT.delete(`${API_URL}/discount/${id}`, {
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

export const getDetailDiscount = async (id) => {
    const res = await axios.get(`${API_URL}/discount/detail/${id}`);
    return res.data;
};