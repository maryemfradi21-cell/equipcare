"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Activity, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Veuillez saisir une adresse email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Connexion réussie");
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error("Erreur de connexion");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] animate-fade-in">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-sm">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Bienvenue sur EquipCare
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/50 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="nom@hopital.tn"
                    autoComplete="email"
                    disabled={isLoading}
                    className={cn(
                      "block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border bg-gray-50 dark:bg-gray-900/50 transition-all duration-200 outline-none focus:bg-white dark:focus:bg-gray-800",
                      errors.email 
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-slide-in">
                    <span className="w-1 h-1 rounded-full bg-red-600 block"></span>
                    {errors.email.message as string}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Mot de passe
                  </label>
                  <Link 
                    href="#" 
                    className="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className={cn(
                      "block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-xl border bg-gray-50 dark:bg-gray-900/50 transition-all duration-200 outline-none focus:bg-white dark:focus:bg-gray-800",
                      errors.password 
                        ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
                        : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    )}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1 animate-slide-in">
                    <span className="w-1 h-1 rounded-full bg-red-600 block"></span>
                    {errors.password.message as string}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

        </div>
          
        {/* Footer info (Mock accounts for testing) */}
        <div className="mt-8 text-center bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Comptes de test activés :</p>
          <div className="flex flex-col gap-1">
            <span>Admin: <strong className="text-gray-900 dark:text-gray-200">admin@equipcare.tn</strong> / Admin123!</span>
            <span>Tech: <strong className="text-gray-900 dark:text-gray-200">technicien@equipcare.tn</strong> / Tech123!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
