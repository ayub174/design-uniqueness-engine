import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inloggning misslyckades",
      description: "Felaktig e-post eller lösenord.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background relative grain-overlay overflow-hidden flex">
      {/* Left — decorative editorial panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary text-secondary-foreground relative overflow-hidden items-end p-16">
        {/* Large decorative number */}
        <span className="font-serif text-[20rem] font-bold leading-none text-secondary-foreground/[0.04] select-none absolute -top-16 -left-8">
          Ch
        </span>

        {/* Decorative accent shape */}
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-40 right-40 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />

        <motion.div
          className="relative z-10 max-w-md"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="text-xs font-medium tracking-widest uppercase text-primary mb-6"
          >
            Sveriges smartaste karriärplattform
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-serif text-5xl xl:text-6xl font-medium leading-[1.08] tracking-tight"
          >
            Välkommen
            <br />
            <span className="italic text-primary">tillbaka</span>.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-8 text-lg text-secondary-foreground/60 leading-relaxed"
          >
            Din nästa karriärmöjlighet väntar. Logga in och fortsätt din resa mot drömjobbet.
          </motion.p>

          {/* Mini stat cards */}
          <motion.div variants={fadeUp} custom={3} className="mt-12 flex gap-6">
            <div className="border border-secondary-foreground/10 p-5">
              <span className="font-serif text-3xl font-medium text-primary">4 200+</span>
              <p className="text-xs text-secondary-foreground/50 mt-1 uppercase tracking-wider">Aktiva jobb</p>
            </div>
            <div className="border border-secondary-foreground/10 p-5">
              <span className="font-serif text-3xl font-medium text-primary">89%</span>
              <p className="text-xs text-secondary-foreground/50 mt-1 uppercase tracking-wider">Matchningsgrad</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        {/* Subtle decorative circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/[0.06] blur-3xl pointer-events-none" />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Logo */}
          <motion.div variants={fadeUp} custom={0} className="mb-10">
            <span
              className="font-serif text-2xl font-semibold tracking-tight text-foreground cursor-pointer"
              onClick={() => navigate("/")}
            >
              Chappie<span className="text-primary">.</span>
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <h2 className="font-serif text-3xl md:text-4xl font-medium leading-tight text-foreground">
              Logga in på
              <br />
              ditt konto <span className="inline-block animate-[wave_2s_ease-in-out_infinite]">👋</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ange dina uppgifter nedan för att komma igång.
            </p>
          </motion.div>

          <motion.form variants={fadeUp} custom={2} onSubmit={handleSubmit} className="mt-10 space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-post</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type="email"
                  placeholder="namn@exempel.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-card border-border"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-12 h-12 bg-card border-border"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Kom ihåg mig
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Glömt lösenord?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-sm font-medium uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 gap-2 group"
            >
              Logga in
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.form>

          {/* Sign up link */}
          <motion.p variants={fadeUp} custom={3} className="mt-6 text-center text-sm text-muted-foreground">
            Ny på plattformen?{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Skapa ett konto
            </a>
          </motion.p>

          {/* Divider */}
          <motion.div variants={fadeUp} custom={4} className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest">eller</span>
            <div className="flex-1 h-px bg-border" />
          </motion.div>

          {/* Google */}
          <motion.div variants={fadeUp} custom={5} className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-sm font-medium border-border hover:border-primary/30 hover:bg-card gap-3 group"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Fortsätt med Google
            </Button>
          </motion.div>

          {/* Footer note */}
          <motion.p variants={fadeUp} custom={6} className="mt-10 text-center text-xs text-muted-foreground/60">
            Genom att logga in godkänner du våra{" "}
            <a href="#" className="underline hover:text-muted-foreground transition-colors">villkor</a>
            {" "}och{" "}
            <a href="#" className="underline hover:text-muted-foreground transition-colors">integritetspolicy</a>.
          </motion.p>
        </motion.div>
      </div>

      {/* Wave animation keyframes */}
      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(15deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
