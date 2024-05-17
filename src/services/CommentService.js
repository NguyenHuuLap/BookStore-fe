import axios from "axios"
import { axiosJWT } from "./UserService"

export const createComment = async (id, comment, access_token) => {
    const data = { comment, id }
    console.log(data)
    // console.log(comment)
    // console.log(commentItem)
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/comment/create/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsComment = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment/get-details/${id}`)
    return res.data
}

export const getAllComment = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/comment/get-all-comment`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    },)
    return res.data
}

export const updateComment = async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/comment/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteComment = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/comment/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteManyComment = async (data, access_token,) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/comment/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}