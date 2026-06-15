"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { VerifyEmailForm } from "./verify-email-form";
import { ResendVerificationForm } from "./resend-verification-form";

export function VerifyEmail() {
  const [showResend, setShowResend] = useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!showResend ? (
          <motion.div
            key="otp"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}>
            <VerifyEmailForm onResend={() => setShowResend(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="resend"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.25 }}>
            <ResendVerificationForm onBack={() => setShowResend(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

