"use client";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { useAuth } from "../../hook/UseAuth";
import Navbar from "@/components/layout/Navbar";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Particle background component
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
      canvas.style.opacity = "0.15";
      canvas.style.zIndex = "0";
      document.body.appendChild(canvas);

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", resize);
      resize();

      const particles = Array(100)
        .fill(0)
        .map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.5 + 0.1,
        }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(34, 211, 238, ${Math.random() * 0.3})`;
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          particle.y -= particle.speed;
          if (particle.y < 0) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
          }
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

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center space-y-3">
          <div className="flex space-x-2 justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-cyan-400 rounded-full"
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <motion.p
            className="text-cyan-400 font-mono text-sm"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            AUTHENTICATING...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 overflow-hidden relative">
      {/* Background elements */}
      <Particles />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-cyan-400/10 rounded-full filter blur-[100px] animate-float"></div>
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-purple-400/10 rounded-full filter blur-[100px] animate-float delay-2000"></div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Main Content */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-10 border-b border-gray-700 pb-6"
          >
            <h1 className="text-3xl md:text-4xl font-light text-gray-100">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {user.email}
              </span>
            </h1>
            <p className="text-gray-400 mt-2 font-mono text-sm">
              Last login: {new Date().toLocaleString()}
            </p>
          </motion.div>

          {/* System Modules */}
          <div className="space-y-8">
            {/* Web Attack Module */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all hover:shadow-lg hover:shadow-cyan-400/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-cyan-400 mr-3 animate-pulse"></div>
                <h2 className="text-xl font-medium text-gray-100">
                  WEB_ATTACK_CLUSTERING_MODULE
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: "THREAT_VISUALIZATION",
                    icon: "🔍",
                    color: "bg-cyan-500/20",
                  },
                  {
                    name: "CLUSTER_ANALYSIS",
                    icon: "📊",
                    color: "bg-purple-500/20",
                  },
                  {
                    name: "CENTROID_DATA",
                    icon: "⚙️",
                    color: "bg-blue-500/20",
                  },
                  { name: "STATISTIC", icon: "📈", color: "bg-green-500/20" },
                  {
                    name: "PERF_METRICS",
                    icon: "⏱️",
                    color: "bg-yellow-500/20",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className={`group p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-cyan-400/20 transition-colors ${feature.color}`}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{feature.icon}</span>
                      <p className="font-mono text-sm text-gray-300 group-hover:text-cyan-400">
                        $ {feature.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Data Operations */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-purple-400/30 transition-all hover:shadow-lg hover:shadow-purple-400/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-3 animate-pulse"></div>
                <h2 className="text-xl font-medium text-gray-100">
                  DATA_OPERATIONS
                </h2>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  {
                    name: "DATA_UPLOAD",
                    icon: "📤",
                    color: "from-purple-500 to-indigo-600",
                  },
                  {
                    name: "DATA_PREVIEW",
                    icon: "👁️",
                    color: "from-blue-500 to-cyan-600",
                  },
                ].map((op, i) => (
                  <motion.button
                    key={i}
                    className={`group px-5 py-3 rounded-lg border border-gray-700 transition-all flex items-center bg-gradient-to-r ${op.color} hover:shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-3 text-lg">{op.icon}</span>
                    <p className="font-mono text-sm">$ {op.name}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* System Console */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 hover:border-green-400/30 transition-all hover:shadow-lg hover:shadow-green-400/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-3 animate-pulse"></div>
                <h2 className="text-xl font-medium text-gray-100">
                  SYSTEM_LOG_OUTPUT
                </h2>
              </div>

              <div className="bg-gray-900/70 p-4 rounded-lg font-mono text-xs text-gray-300 h-40 overflow-y-auto border border-gray-700">
                <p className="text-green-400">$ SYSTEM_STATUS: OPERATIONAL</p>
                <p>$ USER: {user.email}</p>
                <p>$ SESSION_START: {new Date().toLocaleString()}</p>
                <p className="mt-3 text-cyan-400">$ INIT_MODULES:</p>
                <p>- ThreatDetectionEngine ✓</p>
                <p>- ClusterAnalysis ✓</p>
                <p>- DataVisualizer ✓</p>
                <p className="mt-3 text-purple-400">$ ACTIVE_CONNECTIONS:</p>
                <p>- Database: 3 active</p>
                <p>- API: 2 requests/sec</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900/80 border-t border-gray-700 px-6 py-3 flex justify-between items-center text-xs backdrop-blur-sm"
        >
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-gray-300">SYSTEM_READY</span>
            </span>
            <span className="text-gray-400 font-mono">v2.4.1</span>
            <span className="hidden md:inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
              <span className="text-gray-300">NETWORK: STABLE</span>
            </span>
          </div>
          <div className="text-gray-400 font-mono">
            {new Date().toLocaleTimeString()} |{" "}
            {new Date().toLocaleDateString()}
          </div>
        </motion.div>
      </div>

      {/* Global styles for animations */}
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
}
