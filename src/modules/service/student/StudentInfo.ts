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

export const allnotifications = async (subscriberId: any) => {
  try {
    const response = await Axios.get(`/notifications/${subscriberId}`);
    return response.data; // <-- return the notifications array
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // rethrow if you want the calling code to handle it
  }
};