import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Dispatch, SetStateAction } from "react";

interface InputOTPPatternProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

export function InputOTPPattern({ value, onChange }: InputOTPPatternProps) {
  const handleChange = (val: string | null) => {
    onChange(val ?? ""); // fallback to empty string if null
  };

  return (
    <InputOTP
      value={value}
      onChange={handleChange}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
    >
      <InputOTPGroup>
        <InputOTPSlot autoFocus index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
