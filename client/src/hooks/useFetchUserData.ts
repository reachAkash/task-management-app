import { axiosInstance } from "@/axios/axiosInstance";
import { getSingleUserRoute, refreshTokenRoute } from "@/axios/apiRoutes";
import { useProjectStore, useUserStore } from "@/states/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useFetchUserData = () => {
  const { setUser } = useUserStore();
  const { setProjects } = useProjectStore();
  const router = useRouter();

  const refreshToken = useCallback(async () => {
    try {
      const data = await axiosInstance.post(refreshTokenRoute);
      if (data.status == 200) {
        await getUserData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Session expired! Please Log in.");
      router.push("/login");
    }
  }, [router]);

  const getUserData = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`${getSingleUserRoute}/`);
      const userData = data?.data;
      setUser(userData);
      setProjects(userData?.projects || []);
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token expired. Trying refresh...");
        await refreshToken();
      } else {
        console.error("Other error:", err);
      }
    }
  }, [refreshToken]);

  return { getUserData, refreshToken };
};
