import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api.js";
import { toast } from "react-hot-toast";


export const useLogin = () => {
    const queryClient = useQueryClient();
 const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

    return { isPending, error, loginMutation };
}
