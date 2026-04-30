import * as yup from "yup";

// ─── Regex (mirrors backend constants/regex) ──────────────────────────────────

const AT_LEAST_ONE_NUMBER = /\d/;
const AT_LEAST_ONE_LETTER = /[a-zA-Z]/;
const AT_LEAST_ONE_LOWERCASE = /[a-z]/;
const AT_LEAST_ONE_UPPERCASE = /[A-Z]/;
const AT_LEAST_ONE_SPECIAL_CHAR = /[^a-zA-Z0-9]/;

// ─── Field Schemas ────────────────────────────────────────────────────────────

export const emailSchema = yup
  .string()
  .required("Email is required.")
  .min(6, "Email must be at least 6 characters.")
  .max(100, "Email cannot exceed 100 characters.")
  .email("Invalid email address.");

export const passwordSchema = yup
  .string()
  .required("Password is required.")
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password cannot exceed 100 characters.")
  .matches(AT_LEAST_ONE_NUMBER, "At least one number is required.")
  .matches(AT_LEAST_ONE_LETTER, "At least one letter is required.")
  .matches(AT_LEAST_ONE_LOWERCASE, "At least one lowercase letter is required.")
  .matches(AT_LEAST_ONE_UPPERCASE, "At least one uppercase letter is required.")
  .matches(
    AT_LEAST_ONE_SPECIAL_CHAR,
    "At least one special character is required.",
  );

export const confirmPasswordSchema = yup
  .string()
  .required("Please confirm your password.")
  .min(8, "Confirm password must be at least 8 characters.")
  .max(100, "Confirm password cannot exceed 100 characters.");

// ─── Form Schemas ─────────────────────────────────────────────────────────────

export const loginFormSchema = yup.object({
  email: emailSchema,
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters."),
});

export const registerFormSchema = yup
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .test("passwords-match", "Passwords do not match.", function (values) {
    if (values.password && values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        return this.createError({
          path: "confirmPassword",
          message: "Passwords do not match.",
        });
      }
    }
    return true;
  });

export const forgotPasswordFormSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = yup
  .object({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .test("passwords-match", "Passwords do not match.", function (values) {
    if (values.password && values.confirmPassword) {
      if (values.password !== values.confirmPassword) {
        return this.createError({
          path: "confirmPassword",
          message: "Passwords do not match.",
        });
      }
    }
    return true;
  });
