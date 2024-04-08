// app/components/Button/MypageButton.tsx

import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { useAuth } from "@/lib/firebase/hooks/useAuth";

const MypageButton = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  if (!userId) return null;

  return (
    <Link href={`/mypage/${userId}`} passHref>
      <Button as="a" colorScheme="blue">
        マイページへ
      </Button>
    </Link>
  );
};

export default MypageButton;
