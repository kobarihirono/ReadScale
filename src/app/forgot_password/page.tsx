"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { sendPasswordReset } from "@/lib/firebase/apis/auth";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@/common/design";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const {
    register,
    handleSubmit,
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
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormErrorMessage>
        {errors.email && errors.email.message}
      </FormErrorMessage>
      <Button variant="link" onClick={handlePasswordReset}>
        パスワードを忘れた方はこちら
      </Button>
    </FormControl>
  );
};

export default ForgotPasswordPage;
