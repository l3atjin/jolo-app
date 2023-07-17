import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { fetchUserPosts, PostResponse, RequestResponse, fetchUserRequests } from '../utils/requests';
import { UserTypeProvider, useUserType } from './UserTypeProvider';

interface UserPostsContextProps {
  userPosts: PostResponse | null;
  userRequests: RequestResponse | null;
  refreshUserActivity: () => Promise<void>;
}

const UserPostsContext = createContext<UserPostsContextProps | undefined>(undefined);

export const UserPostsProvider = ({ children }: { children: ReactNode }) => {
  const [userPosts, setUserPosts] = useState<PostResponse | null>(null);
  const [userRequests, setUserRequests] = useState<RequestResponse | null>(null);
  const [userType] = useUserType();

  const refreshUserActivity = async () => {
    const posts = await fetchUserPosts(userType);
    const requests = await fetchUserRequests(userType);
    setUserPosts(posts);
    setUserRequests(requests);
  };

  useEffect(() => {
    refreshUserActivity();
  }, [userType]);

  return (
    <UserPostsContext.Provider
      value={{
        userPosts,
        userRequests,
        refreshUserActivity,
      }}
    >
      {children}
    </UserPostsContext.Provider>
  );
};

export const useUserActivity = (): UserPostsContextProps => {
  const context = useContext(UserPostsContext);
  if (!context) {
    throw new Error("useUserActivity must be used within a UserPostsProvider");
  }
  return context;
};
