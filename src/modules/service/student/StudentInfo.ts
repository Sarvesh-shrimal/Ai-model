import Axios from "@/utils/axios/Axios"

export const alluser = async () => {
    const response = await Axios.get('/all-user');
    return response.data;
}

export const studentinfo = async (
    payload: { student_id: string; description: string }

) => {
    const response = await Axios.post('/student-info', payload

    );

    return response;
};
