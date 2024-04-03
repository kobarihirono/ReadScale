// src/app/my-page/[id]/page.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/firebase/hooks/useAuth'; // useAuthフックの正しいパスを確認してください
import { getUserInfo } from '@/lib/firebase/apis/user';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    } else if (id) {
      const fetchUserInfo = async () => {
        const userInfo = await getUserInfo(id.toString());
        setUserInfo(userInfo);
        setLoading(false);
      };

      fetchUserInfo().catch(console.error);
    }
  }, [id, currentUser, router]);

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
