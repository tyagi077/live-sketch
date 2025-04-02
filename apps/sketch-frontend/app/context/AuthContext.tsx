"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

type User = {
  id: string;
  name: string;
  email: string;
  photo: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  roomAdmin: string | null;
  setRoomAdmin: (admin: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

interface ApiError {
  message: string;
  status?: number;
  response?: {
    data: {
      message: string;
    };
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [roomAdmin, setRoomAdmin] = useState<string | null>(null);

  const findUser = async () => {
    try {
      const token = localStorage.getItem("D_token");
      if (token) {
        const response = await axios.get(`${HTTP_BACKEND}/data`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status) {
          setUser(response.data.user);
        } else {
          setUser(null);
          toast.error("Please login again");
        }
      }
    } catch (error) {
      const err = error as ApiError;
      if (err.response) {
        toast.error(err.response.data.message);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    findUser();
  }, []);

  const contextValue: AuthContextType = {
    user,
    setUser,
    roomAdmin,
    setRoomAdmin
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}