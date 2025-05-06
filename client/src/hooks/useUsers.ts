import { useEffect, useState } from "react";
import { axiosInstance } from "@/axios/axiosInstance";
import { getUsersDataRoute } from "@/axios/apiRoutes"; // adjust path
import { useMemberStore } from "@/states/store";

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { setMembers } = useMemberStore();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(getUsersDataRoute);
      const usersData = data?.data;
      setUsers(usersData);
      setMembers(usersData);
    } catch (err: any) {
      console.log("Other error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading };
};
