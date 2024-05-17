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