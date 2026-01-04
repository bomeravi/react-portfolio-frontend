import React, { useState } from "react";
import { motion } from "framer-motion";
import { MailIcon, PhoneIcon, MapPinIcon, SendIcon } from "lucide-react";
import { z } from "zod";
import axios from "axios";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  phone: z
    .string()
    .min(5, "Phone number must be at least 5 characters")
    .refine(
      (value) =>
        /^\+[1-9]\d{1,14}$/.test(value) || /^\d{10}$/.test(value),
      {
        message:
          "Phone must be either in E.164 format (+123...) or a 10-digit local number",
      }
    ),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(250, "Message must not exceed 250 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
   const email = import.meta.env.VITE_EMAIL || 'hello@example.com';
   const phone = import.meta.env.VITE_PHONE || '';
   const displayPhone = import.meta.env.VITE_DISPLAY_PHONE || '';
   const address = import.meta.env.VITE_ADDRESS || '';

   // use Vite env var for API base (fallback to localhost)
   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // For message field, enforce character limit
    if (name === "message" && value.length > 250) {
      return; // Don't update if exceeds limit
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    setStatusMessage(null);
  };

  const validate = (): boolean => {
    const result = contactSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    } else {
      const zodErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ContactForm | undefined;
        if (path) zodErrors[path] = issue.message;
      }
      setErrors(zodErrors);
      return false;
    }
  };

  // Step 1: call presend API to get token
  const presend = async (): Promise<string> => {
    const response = await axios.post(`${API_BASE}/api/v1/presend-contact`, {
      email: formData.email
    });
    
    if (!response.data.token) {
      throw new Error("Presend response missing token");
    }
    
    return response.data.token;
  };

  // Step 2: send full contact with token
  const sendContact = async (token: string) => {
    const response = await axios.post(`${API_BASE}/api/v1/contact`, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      token,
    });
    
    return response.data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!validate()) {
      setStatusMessage({ 
        type: "error", 
        text: "Please fix validation errors and try again." 
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // 1) get token
      const token = await presend();

      // 2) send contact with token
      await sendContact(token);

      // success
      setStatusMessage({ 
        type: "success", 
        text: "Message sent successfully! I will get back to you soon." 
      });

      // reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Contact form error:", err);
      setStatusMessage({ 
        type: "error", 
        text: err.response?.data?.message || err.message || "Failed to send message. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-slate-50 dark:bg-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 px-2">
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 px-4">
            Have a project in mind? Let's work together to create something amazing
          </p>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 px-4 sm:px-0">
                Contact Information
              </h3>
              <div className="space-y-4 px-4 sm:px-0">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <MailIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 break-all"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Phone</p>
                    <a
                      href={`tel:${phone}`}
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {displayPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">Location</p>
                    <p className="text-slate-600 dark:text-slate-300 break-words">{address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block px-4 sm:px-0">
              <img
                src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80"
                alt="Contact"
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sm:p-8 mx-2 sm:mx-0"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    errors.name ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                  } dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-red-600 text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    errors.email ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                  } dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-900 dark:text-white mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 border ${
                    errors.phone ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                  } dark:bg-slate-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="9800000000"
                />
                {errors.phone && (
                  <p className="mt-1 text-red-600 text-sm">{errors.phone}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-900 dark:text-white"
                  >
                    Message
                  </label>
                  {formData.message.length > 0 && (
                    <span className={`text-xs ${
                      formData.message.length > 200 ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {formData.message.length}/250
                    </span>
                  )}
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  maxLength={250}
                  className={`
                    w-full px-3 sm:px-4 py-2 sm:py-3
                    border ${errors.message ? "border-red-500" : "border-slate-300 dark:border-slate-600"}
                    bg-white dark:bg-slate-800
                    text-slate-900 dark:text-slate-100
                    placeholder:text-slate-400 dark:placeholder:text-slate-400
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors resize-none
                  `}
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-red-600 text-sm">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {statusMessage && (
                <div
                  className={`mt-4 p-3 sm:p-4 rounded-lg text-sm ${
                    statusMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {statusMessage.text}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700 px-4">
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
          © 2025 Saroj Bhandari. All rights reserved.
        </p>
      </div>
    </section>
  );
}