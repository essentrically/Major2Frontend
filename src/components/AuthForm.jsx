import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";

import FormField from "./FormField";
import CameraCapture from "./CamerCapture";

import {
  getUserByEmail,
  sendMailOTP,
  validateOtp,
  createUser,
} from "../api/api";
import { routes } from "../routes/routes";

const resizeImage = (base64Str, maxWidth = 96, maxHeight = 96) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, maxWidth, maxHeight);
      const resized = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
      resolve(resized);
    };
  });
};

const signUpFields = [
  { name: "user_name", label: "Name", required: true, type: "text" },
  { name: "dob", label: "Date of Birth", required: true, type: "date" },
  { name: "phone", label: "Phone Number", required: true, type: "tel" },
  { name: "college", label: "College", required: false, type: "text" },
  { name: "college_id", label: "College ID", required: false, type: "text" },
  {
    name: "college_start_year",
    label: "Start Year",
    required: false,
    type: "number",
  },
  {
    name: "college_end_year",
    label: "End Year",
    required: false,
    type: "number",
  },
  { name: "course", label: "Course", required: false, type: "text" },
];

const AuthForm = ({ setUser }) => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin"); // 'signin' or 'signup'
  const [step, setStep] = useState("form"); // 'form' or 'otp'

  const [form, setForm] = useState(() => ({
    email: "",
    otp: "",
    ...Object.fromEntries(signUpFields.map((f) => [f.name, ""])),
  }));

  const [selfie, setSelfie] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Persist form to localStorage (optional)
  useEffect(() => {
    localStorage.setItem("auth_form", JSON.stringify({ form, mode, step }));
  }, [form, mode, step]);

  useEffect(() => {
    const saved = localStorage.getItem("auth_form");
    if (saved) {
      const {
        form: savedForm,
        mode: savedMode,
        step: savedStep,
      } = JSON.parse(saved);
      setForm(savedForm);
      setMode(savedMode || "signin");
      setStep(savedStep || "form");
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      email: "",
      otp: "",
      ...Object.fromEntries(signUpFields.map((f) => [f.name, ""])),
    });
    setSelfie(null);
    setStep("form");
    setMode("signin");
  };

  const handleOtpRequest = async () => {
    const email = form.email.trim();
    if (!email) return toast.error("Please enter your email.");
    if (mode === "signup" && !selfie)
      return toast.error("Please capture your selfie.");

    try {
      setLoading(true);
      const userExists = await getUserByEmail(email);

      if (mode === "signup" && !userExists?.is_error) {
        toast.error("User already registered. Please sign in.");
        navigate(routes.SIGNIN);
        return;
      }

      if (mode === "signin" && userExists?.is_error) {
        toast.error("User not found. Please sign up.");
        navigate(routes.SIGNUP);
        return;
      }

      const sent = await sendMailOTP(email);
      if (sent) {
        toast.success("OTP sent successfully!");
        setStep("otp");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (err) {
      console.error("OTP Request Failed:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpValidation = async () => {
    try {
      setLoading(true);
      const valid = await validateOtp(form.email, form.otp);
      if (!valid) return toast.error("Invalid OTP. Please try again.");

      toast.success("OTP verified!");

      if (mode === "signin") {
        const userData = await getUserByEmail(form.email);
        if (!userData || userData.is_error) {
          toast.error("Failed to fetch user data.");
          return;
        }
        const userDataPayload = userData?.data;
        const finalUser = {
          name: userDataPayload?.user_name || "DeltaCode's Users",
          base64image: userDataPayload?.user_photo || "",
          email: userData?.email,
          dob: userDataPayload?.dob || "",
          phone: userDataPayload?.phone_number || "",
          college: userDataPayload?.college || "",
          college_id: userDataPayload?.college_id || "",
          college_start_year: userDataPayload?.college_start_year || "",
          college_end_year: userDataPayload?.college_end_year || "",
          course: userDataPayload?.course || "",
        };

        localStorage.setItem("auth_user_deltacode", JSON.stringify(finalUser));
        setUser(finalUser);
      }

      if (mode === "signup") {
        const resizedImage = await resizeImage(selfie, 104, 104);
        const base64Selfie = resizedImage.split(",")[1];

        const isCreated = await createUser(
          form.email,
          form.user_name,
          form.dob,
          form.phone,
          base64Selfie,
          form.college,
          form.college_id,
          form.college_start_year,
          form.college_end_year,
          form.course
        );

        if (!isCreated) {
          toast.error("Failed to create account.");
          return;
        }

        const finalUser = {
          name: form.user_name,
          base64image: base64Selfie,
          email: form.email,
          dob: form.dob,
          phone: form.phone,
          college: form.college,
          college_id: form.college_id,
          college_start_year: form.college_start_year,
          college_end_year: form.college_end_year,
          course: form.course,
        };

        localStorage.setItem("auth_user_deltacode", JSON.stringify(finalUser));
        setUser(finalUser);
      }

      resetForm();
      window.location.href = routes.HOME;
    } catch (err) {
      console.error("OTP Validation Failed:", err);
      toast.error("Some Internal Error Occured, Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSignUpFields = () =>
    signUpFields.map((field) => (
      <FormField
        key={field.name}
        field={field}
        value={form[field.name]}
        onChange={handleChange}
      />
    ));

  return (
    <div className="bg-[var(--color-bg)] text-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-zinc-900 w-full max-w-lg p-8 rounded-xl shadow-xl">
        {/* Toggle */}
        <div className="flex justify-between mb-6">
          {["signin", "signup"].map((option) => (
            <button
              key={option}
              onClick={() => {
                setMode(option);
                setStep("form");
              }}
              className={`w-1/2 py-2 rounded font-semibold ${
                mode === option
                  ? "bg-[var(--color-primary)] text-black"
                  : "text-zinc-400"
              }`}
            >
              {option === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        {step === "form" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOtpRequest();
            }}
            className="space-y-5"
          >
            <FormField
              field={{
                name: "email",
                label: "Email",
                required: true,
                type: "email",
              }}
              value={form.email}
              onChange={handleChange}
            />

            {mode === "signup" && (
              <>
                {renderSignUpFields()}
                <CameraCapture onCapture={setSelfie} required />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-black py-2 rounded font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <div className="space-y-4">
            <label className="text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              className="w-full bg-zinc-800 border border-zinc-700 p-2 rounded text-white"
            />
            <button
              onClick={handleOtpValidation}
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-black py-2 rounded font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? (
                "Verifying..."
              ) : (
                <>
                  Verify & Continue <FaArrowRight className="inline ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
