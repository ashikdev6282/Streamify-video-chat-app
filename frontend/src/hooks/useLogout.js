import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";


export const useLogout = () => {

  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries(["authUser" ]),
  });

    return { logoutMutation, isPending, error };

}
