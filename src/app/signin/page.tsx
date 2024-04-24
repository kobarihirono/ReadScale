// src/app/signin/page.tsx

"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@/common/design";

import { signInWithEmail } from "@/lib/firebase/apis/auth";

type formInputs = {
  email: string;
  password: string;
};

/** サインイン画面
 * @screenname SignInScreen
 * @description ユーザのサインインを行う画面
 */
export default function SignInScreen() {
  const toast = useToast();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<formInputs>();

  const [show, setShow] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    await signInWithEmail({
      email: data.email,
      password: data.password,
    }).then((res) => {
      if (res.isSuccess) {
        toast({
          title: res.message,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        router.push("/search"); // 成功後に検索ページへリダイレクト
      } else {
        toast({
          title: res.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    });
  });

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing="5">
        <Heading>ログイン</Heading>
        <form onSubmit={onSubmit}>
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
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={Boolean(errors.password)}>
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  {...register("password", {
                    required: "必須項目です",
                    minLength: {
                      value: 8,
                      message: "8文字以上で入力してください",
                    },
                    maxLength: {
                      value: 50,
                      message: "50文字以内で入力してください",
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <Box display="flex" justifyContent="center" mt="4">
              <Button
                color="white"
                bg="blue.700"
                isLoading={isSubmitting}
                type="submit"
                py="2"
                px="8"
                rounded="full"
                w="auto"
                _hover={{
                  borderColor: "transparent",
                  bg: "blue.600",
                }}
              >
                ログイン
              </Button>
            </Box>{" "}
            <Button
              as={NextLink}
              href="/forgot_password"
              variant="link"
              marginTop="2"
            >
              パスワードを忘れた場合
            </Button>
            <Button
              as={NextLink}
              bg="white"
              color="black"
              href="/signup"
              width="100%"
              _hover={{
                borderColor: "transparent",
                boxShadow: "0 7px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              新規登録はこちらから
            </Button>
          </VStack>
        </form>
      </VStack>
    </Flex>
  );
}
