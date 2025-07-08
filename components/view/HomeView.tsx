"use client";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useAuth } from "@/hook/UseAuth";

const HomePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Properly typed animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  // Simple Particles component without external hook
  const Particles = useCallback(() => {
    useEffect(() => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.opacity = "0.2";
      document.body.appendChild(canvas);

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", resize);
      resize();

      const particles = Array(50)
        .fill(0)
        .map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
        }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(34, 211, 238, ${Math.random() * 0.2})`;
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(animate);
      };
      animate();

      return () => {
        window.removeEventListener("resize", resize);
        document.body.removeChild(canvas);
      };
    }, []);

    return null;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Particles Background */}
      <Particles />

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-400/10 rounded-full filter blur-[100px] animate-float"></div>
        <div className="absolute top-[60%] right-[10%] w-64 h-64 bg-purple-400/10 rounded-full filter blur-[100px] animate-float delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="text-center"
        >
          {/* Logo/Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-400/30 flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              CyberShield
            </span>{" "}
            Analytics
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Advanced threat detection and security analytics powered by AI and
            machine learning
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-20"
          >
            <button
              onClick={() => router.push("/auth/register")}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-4 bg-transparent border-2 border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Sign In
            </button>
          </motion.div>

          {/* Feature Showcase */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: "🧠",
                title: "AI-Powered Analysis",
                description: "Real-time threat detection using neural networks",
              },
              {
                icon: "📊",
                title: "Cluster Visualization",
                description: "Interactive 3D mapping of attack patterns",
              },
              {
                icon: "⚡",
                title: "Real-Time Alerts",
                description: "Instant notifications for suspicious activity",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-400/30 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 py-8 border-t border-gray-800 text-center"
      >
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} CyberShield Analytics. All rights
          reserved.
        </p>
      </motion.footer>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
