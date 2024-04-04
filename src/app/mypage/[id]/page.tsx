// src/app/my-page/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/firebase/hooks/useAuth';
import { getUserInfo } from '@/lib/firebase/apis/user';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentUser) {
      router.push('/signin');
    } else if (pathname) {
      const fetchUserInfo = async () => {
        const userInfo = await getUserInfo(pathname.toString());
        setUserInfo(userInfo);
        setLoading(false);
      };

      fetchUserInfo().catch(console.error);
    }
  }, [pathname, currentUser, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My Page</h1>
      {userInfo && (
        <div>
          <p>Username: {userInfo.username}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default MyPage;
