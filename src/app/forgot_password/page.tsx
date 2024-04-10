// src/app/forgot_password/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { sendPasswordReset } from "@/lib/firebase/apis/auth";

import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@/common/design";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const {
    register,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  const handlePasswordReset = async () => {
    if (!email) {
      toast({
        title: "メールアドレスを入力してください",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const result = await sendPasswordReset(email);
    toast({
      title: result.message,
      status: result.isSuccess ? "success" : "error",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing="5">
        <Image src="/icons/lock.png" alt="鍵マーク" width={40} height={40} />
        <Heading>パスワード再設定</Heading>
        <form onSubmit={handlePasswordReset}>
          <VStack spacing="4" alignItems="left">
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email" textAlign="start">
                設定済みのメールアドレスを入力してください
              </FormLabel>
              <Input
                id="email"
                {...register("email", {
                  required: "必須項目です",
                  maxLength: {
                    value: 50,
                    message: "50文字以内で入力してください",
                  },
                })}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>
                {errors.email &&
                  typeof errors.email.message === "string" &&
                  errors.email.message}{" "}
              </FormErrorMessage>
            </FormControl>

            <Button
              marginTop="4"
              color="white"
              bg="blue.700"
              py="2"
              px="8"
              rounded="full"
              _hover={{
                borderColor: "transparent",
                bg: "blue.600",
              }}
            >
              送信する
            </Button>
            <Button
              as={NextLink}
              href="/signin"
              bg="white"
              color="teal.500"
              width="100%"
              _hover={{
                borderColor: "transparent",
                boxShadow: "0 7px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              ログイン画面に戻る
            </Button>
          </VStack>
        </form>
      </VStack>
    </Flex>
  );
};

export default ForgotPasswordPage;
