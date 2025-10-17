import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  fieldName?: "password" | "confirmPassword";
  placeholder?: string;
}

export function PasswordField({
  register,
  errors,
  fieldName = "password",
  placeholder = fieldName === "confirmPassword"
    ? "Conferma Password"
    : "Password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="grid gap-2">
      <div className="grid relative">
        <Input
          id={fieldName}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={
            fieldName === "confirmPassword"
              ? "new-password"
              : "current-password"
          }
          {...register(fieldName)}
          className="pr-10"
        />

        <Button
          type="button"
          size="icon"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent"
          aria-label={visible ? "Nascondi password" : "Mostra password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
      </div>

      {errors[fieldName] && (
        <p className="text-sm text-red-600">
          {errors[fieldName]?.message?.toString()}
        </p>
      )}
    </div>
  );
}
