// src/app/forgot_password/page.tsx
"use client";

import { useForm } from "react-hook-form";
import NextLink from "next/link";
import { sendPasswordReset } from "@/lib/firebase/apis/auth";
import type { FormData } from "../../types/index";
import { FaKey } from "react-icons/fa";

import {
  Box,
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const toast = useToast();

  const handlePasswordReset = async (data: FormData) => {
    const { email } = data;

    function isFirebaseError(error: unknown): error is { code: string } {
      return typeof error === "object" && error !== null && "code" in error;
    }

    if (!email) {
      toast({
        title: "メールアドレスを入力してください",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const result = await sendPasswordReset(email);
      toast({
        title: result.message,
        status: result.isSuccess ? "success" : "error",
        duration: 2000,
        isClosable: true,
      });
      if (result.isSuccess) {
        reset();
      }
    } catch (error) {
      if (isFirebaseError(error)) {
        toast({
          title: "未登録のメールアドレスです",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "エラーが発生しました",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        spacing="5"
        as="form"
        onSubmit={handleSubmit(handlePasswordReset)}
      >
        <FaKey size="30px" color="#265073" />
        <Heading>パスワード再設定</Heading>
        <VStack spacing="4" alignItems="left">
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel htmlFor="email" textAlign="start">
              メールアドレス
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
              onChange={(e) => e.target.value}
            />
            <FormErrorMessage>
              {errors.email &&
                typeof errors.email.message === "string" &&
                errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" justifyContent="center" mt="4">
            <Button
              color="white"
              bg="blue.700"
              py="2"
              px="8"
              rounded="full"
              w="auto"
              _hover={{
                borderColor: "transparent",
                bg: "blue.600",
              }}
              type="submit"
              variant="link"
            >
              送信する
            </Button>
          </Box>
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
      </VStack>
    </Flex>
  );
};

export default ForgotPasswordPage;
