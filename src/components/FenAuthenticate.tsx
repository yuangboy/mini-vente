"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";

// **********************************************************

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useRegisterMutation,
  useLoginMutation,
  useResendActivateEmailMutation,
  BASE_URL,
} from "@/src/store/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { toogleLoginInDialog, authStatus } from "@/src/store/slice/userSlice";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { BsSendCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { resetState } from "../store/reset";

//************************************************************* */

interface DialogDemoProps {
  isOpen: boolean;
  onClose: () => void;
}


const SchemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

const SchemaRegister = z.object({
  lastName: z.string().min(3),
  firstName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
});
const SchemaResendActivateEmail = z.object({
  email: z.string().email(),
});

const SchemaResetPassword = z.object({
  password: z.string().min(4),
  confirmPassword: z.string().min(4),
});

export type IRegister = z.infer<typeof SchemaRegister>;
export type ILogin = z.infer<typeof SchemaLogin>;
export type IResendActivateEmail = z.infer<typeof SchemaResendActivateEmail>;
export type IResetPassword = z.infer<typeof SchemaResetPassword>;


export function DialogDemo({ isOpen, onClose }: DialogDemoProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(
    "login"
  );
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);


  const dispatch = useDispatch();

  // mutation RTK Query
  const [register, { isLoading: isLoadingRegister }] = useRegisterMutation();
  const [login, { isLoading: isLoadingLogin }] = useLoginMutation();
  const [resendActivateEmail,{isLoading:isLoadingResendEmail}]=useResendActivateEmailMutation();

  const loginForm = useForm<ILogin>({
    resolver: zodResolver(SchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerForm = useForm<IRegister>({
    resolver: zodResolver(SchemaRegister),
    defaultValues: {
      email: "",
      lastName: "",
      firstName: "",
      password: "",
    },
  });
  const resendActivateEmailForm = useForm<IResendActivateEmail>({
    resolver: zodResolver(SchemaResendActivateEmail),
    defaultValues: {
      email: "",
    },
  });

  const submitLogin: SubmitHandler<ILogin> = async (data) => {
    try {
      dispatch(resetState());
      const response = await login(data).unwrap();

      if (response.success) {
        toast.success("Connexion réussie");
        registerForm.reset();
        dispatch(toogleLoginInDialog());
        dispatch(authStatus());
        if(!isLoadingLogin){
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(`Echec connexion: ${error}`);
    }
  };

  const submitRegister: SubmitHandler<IRegister> = async (data) => {
    try {
      if (data.password !== confirmPassword) {
        console.log("les mots de passe ne sont pas identiques");
        return;
      }
        const response = await register(data).unwrap();
        if (response.success) {
          console.log("response auth", response);
          toast.success(
            "Inscription réussie, veuillez consulter votre boite mail pour activer votre compte"
          );
          dispatch(toogleLoginInDialog());
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitResendActivateEmail: SubmitHandler<IResendActivateEmail> = async(data) => {
    try {

      const response=await resendActivateEmail(data).unwrap();
      
      if(response.success){
        console.log("response resend: ",response);
        setIsSendEmail(true);
        toast.success("Email envoyé");
      }
      
    } catch (error) {
      console.log("error resend: ",error);
      setIsSendEmail(false);
    }
  };


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


return ReactDOM.createPortal(
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="p-0 bg-transparent border-none mt-10 flex justify-center items-center min-h-[80vh] px-4 sm:px-6 md:px-8">
        <div className=" text-white rounded-2xl shadow-2xl w-full max-w-xl p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
          {/* Tabs */}
          <div className="flex justify-between mb-6 border-b border-gray-700 text-sm sm:text-base">
            {["login", "register", "forgot"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 transition-all ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 font-semibold text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "login"
                  ? "Connexion"
                  : tab === "register"
                  ? "Inscription"
                  : "Renvoyer Email"}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="space-y-6">
            {activeTab === "login" && (
              <>
                <form
                  className="space-y-4"
                  onSubmit={loginForm.handleSubmit(submitLogin)}
                >
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        L'email doit être valide
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        Le mot de passe doit avoir au moins 4 caractères
                      </p>
                    )}
                  </div>
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
                    type="submit"
                    disabled={isLoadingLogin}
                  >
                    {isLoadingLogin ? "Connexion en cours..." : "Connexion"}
                  </button>
                </form>

              </>
            )}

            {activeTab === "register" && (
              <form
                className="space-y-4"
                onSubmit={registerForm.handleSubmit(submitRegister)}
              >
                <div>
                  
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Votre nom"
                    {...registerForm.register("lastName")}
                    className="text-white"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">
                      Le nom doit avoir au moins 3 caractères
                    </p>
                  )}
                </div>
                <div>
                 
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Votre prenom"
                    {...registerForm.register("firstName")}
                    className="text-white"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">
                      Le prenom doit avoir au moins 3 caractères
                    </p>
                  )}
                </div>
                <div>
                 
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...registerForm.register("email")}
                    className="text-white"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      L'email doit être valide
                    </p>
                  )}
                </div>
                <div>
                  
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                    className="text-white"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      Le mot de passe doit avoir au moins 4 caractères
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-white"
                  />
                  {confirmPassword !== registerForm.getValues("password") && (
                    <p className="text-red-600 text-sm mt-1">
                      Les mots de passe ne correspondent pas
                    </p>
                  )}
                </div>
        
                <button
                  disabled={isLoadingRegister}
                  className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-semibold"
                >
                  {isLoadingRegister ? "Chargement..." : "S'inscrire"}
                </button>
              </form>
            )}

            {activeTab === "forgot" &&
              (isSendEmail ? (
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BsSendCheck className="text-green-500 text-4xl mx-auto" />
                  </motion.div>
                  <p className="text-green-500 text-lg">
                    Email envoyé avec succès
                  </p>
                  <p className="text-gray-400 text-sm">
                    Consultez votre boîte mail
                  </p>
                  <button
                    className="text-blue-500 underline text-sm"
                    onClick={() => setIsSendEmail(false)}
                  >
                    Revenir au formulaire
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={resendActivateEmailForm.handleSubmit(
                    submitResendActivateEmail
                  )}
                >
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...resendActivateEmailForm.register("email")}
                    />
                    {resendActivateEmailForm.formState.errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {
                          resendActivateEmailForm.formState.errors.email.message
                        }
                      </p>
                    )}
                  </div>
                  <button
                    className={`${
                      isLoadingResendEmail
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg font-semibold flex items-center justify-center`}
                  >
                    {isLoadingResendEmail ? (
                      <Loader
                        className="animate-spin text-blue-500"
                        size={24}
                      />
                    ) : (
                      "Renvoyer l'email d'activation"
                    )}
                  </button>
                </form>
              ))}
          </div>
        </div>
  
    </DialogContent>
  </Dialog>,
  document.body
);


  
 
}
