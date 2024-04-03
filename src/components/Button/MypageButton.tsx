// app/components/Button/MypageButton.tsx

import Link from 'next/link';
import { Button } from '@chakra-ui/react';
import { useAuth } from '@/lib/firebase/hooks/useAuth'; // useAuthフックの正しいパスを確認してください

const MypageButton = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  if (!userId) return null; // ユーザーIDがない場合は何も表示しない

  return (
    <Link href={`/my-page/${userId}`} passHref>
      <Button as="a" colorScheme="blue">マイページへ</Button>
    </Link>
  );
};

export default MypageButton;
