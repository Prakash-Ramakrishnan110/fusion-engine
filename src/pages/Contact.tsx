import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Mail, Phone, MapPin, Send, ArrowLeft, MessageSquare, Clock, CheckCircle, Download, Image } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import usePageMeta from "@/hooks/usePageMeta";
import LottieAnimation, { LOTTIE_URLS } from "@/components/LottieAnimation";
import emailjs from '@emailjs/browser';

const Contact = () => {
  usePageMeta("Contact", "📬");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const contactFeatures = [
    { icon: MessageSquare, title: "Quick Response", desc: "2 hour reply time" },
    { icon: Clock, title: "24/7 Support", desc: "Always available" },
    { icon: CheckCircle, title: "Free Consultation", desc: "No obligation" },
    { icon: Mail, title: "Direct Contact", desc: "Personal service" }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // EmailJS configuration
      const SERVICE_ID = 'service_vtbrgi5';
      const TEMPLATE_ID = 'template_p8i38d6';
      const PUBLIC_KEY = 'QNzyFmRohhj8Soht0';
      
      // Prepare email template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone,
        message: formData.message,
        to_email: 'prakash7418r@gmail.com',
        reply_to: formData.email,
        time: new Date().toLocaleString()
      };
      
      // Send email using EmailJS
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      
      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('There was an error sending your message. Please try again or contact us directly at prakash7418r@gmail.com');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section ref={containerRef} className="relative min-h-screen flex items-center pt-24 sm:pt-28 lg:pt-32 overflow-hidden">
          {/* Animated RGB Background */}
          <div className="absolute inset-0">
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 50%, rgba(34, 197, 94, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(34, 197, 94, 0.3) 50%, rgba(59, 130, 246, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(168, 85, 247, 0.3) 100%)',
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <motion.div 
            className="container mx-auto px-4 relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center lg:text-left"
              >
                {/* Advanced Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium mb-6"
                >
                  <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                  Get In Touch • Let's Connect
                </motion.div>

                {/* Sophisticated Headline */}
                <motion.h1 
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Let's Build
                  <motion.span 
                    className="text-rose-600 block"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Something Amazing
                  </motion.span>
                </motion.h1>

                {/* Advanced Description */}
                <motion.p 
                  className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Ready to transform your idea into reality? We're here to help you every step of the way.
                  <span className="font-semibold text-foreground"> Let's create something extraordinary</span> and 
                  <span className="text-rose-600 font-semibold"> make it happen!</span>
                </motion.p>

                {/* Advanced CTA Section */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                    <motion.div>
                      <a
                        href="#contact-form"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-rose-600 text-white rounded-xl font-semibold shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <span>Send Message</span>
                        <Send size={16} className="sm:size-18" />
                      </a>
                    </motion.div>
                    <motion.div>
                      <a
                        href="tel:+916369884331"
                        className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-border rounded-xl font-medium text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <span>Call Now</span>
                      </a>
                    </motion.div>
                  </div>
                  
                  {/* Advanced Trust Indicators */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-muted-foreground text-center lg:text-left">
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Quick response guaranteed</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <span>Free consultation</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Advanced Lottie Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative lg:block hidden"
                style={{ 
                  height: 400
                }}
              >
                <LottieAnimation
                  url={LOTTIE_URLS.email}
                  className="w-full h-full"
                  style={{
                    transform: `rotateY(${mousePosition.x * 12 - 6}deg) rotateX(${mousePosition.y * -12 + 6}deg)`
                  }}
                />
                {/* Floating Features */}
                {contactFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="absolute bg-background/90 backdrop-blur-sm border border-rose-500/20 rounded-lg p-3 shadow-lg"
                    style={{
                      top: `${15 + index * 22}%`,
                      right: index % 2 === 0 ? '-8%' : 'auto',
                      left: index % 2 === 1 ? '-8%' : 'auto'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon size={14} className="text-rose-600" />
                      <div>
                        <div className="font-semibold text-xs">{feature.title}</div>
                        <div className="text-xs text-muted-foreground">{feature.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile Lottie Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:hidden relative mt-8"
                style={{ height: 250 }}
              >
                <LottieAnimation
                  url={LOTTIE_URLS.email}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          </motion.div>
        </section>
       

        <section className="py-16">
          <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Send us a <span className="text-primary">Message</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Ready to start your project? Fill out the form below and we'll get back to you within 2 hours.
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm text-center backdrop-blur-sm"
                    >
                      ✅ Message sent successfully! We'll get back to you within 2 hours.
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="peer w-full px-4 py-4 bg-background/50 border-2 border-border/30 rounded-xl text-foreground placeholder-transparent focus:outline-none focus:border-primary/50 focus:bg-background/70 transition-all duration-300"
                        placeholder="Full Name"
                      />
                      <label 
                        htmlFor="name"
                        className="absolute left-4 -top-2.5 bg-background px-2 text-xs text-primary font-medium transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background"
                      >
                        Full Name
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="peer w-full px-4 py-4 bg-background/50 border-2 border-border/30 rounded-xl text-foreground placeholder-transparent focus:outline-none focus:border-primary/50 focus:bg-background/70 transition-all duration-300"
                        placeholder="Email Address"
                      />
                      <label 
                        htmlFor="email"
                        className="absolute left-4 -top-2.5 bg-background px-2 text-xs text-primary font-medium transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background"
                      >
                        Email Address
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="peer w-full px-4 py-4 bg-background/50 border-2 border-border/30 rounded-xl text-foreground placeholder-transparent focus:outline-none focus:border-primary/50 focus:bg-background/70 transition-all duration-300"
                      placeholder="Phone Number"
                    />
                    <label 
                      htmlFor="phone"
                      className="absolute left-4 -top-2.5 bg-background px-2 text-xs text-primary font-medium transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background"
                    >
                      Phone Number
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="peer w-full px-4 py-4 bg-background/50 border-2 border-border/30 rounded-xl text-foreground placeholder-transparent focus:outline-none focus:border-primary/50 focus:bg-background/70 transition-all duration-300 resize-none"
                      placeholder="Tell us about your project..."
                    />
                    <label 
                      htmlFor="message"
                      className="absolute left-4 -top-2.5 bg-background px-2 text-xs text-primary font-medium transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary peer-focus:bg-background"
                    >
                      Project Details
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="flex-1 group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send size={18} />
                        Send Message
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    </button>

                    <a
                      href="https://wa.me/916369884331?text=Hi%20Prakash,%20I'm%20interested%20in%20your%20services!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/25"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.058-.371-.025-.521-.075-.149-.669-1.611-.916-1.996-.243-.381-.495-.299-.673-.305-.173-.006-.371-.009-.57-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.122-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        Chat on WhatsApp
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    </a>
                  </div>
                </form>
              </motion.div>

              {/* Right Side Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                {/* Lottie Animation */}
                <div className="relative">
                  <LottieAnimation
                    url={LOTTIE_URLS.email}
                    className="w-full h-80"
                  />
                </div>

                {/* Quick Contact Info */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold mb-4 text-primary">Quick Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Mail size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">prakash7418r@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Phone size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-muted-foreground">+91 6369884331</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Clock size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">Response Time</div>
                        <div className="text-sm text-muted-foreground">Within 2 hours</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why Contact Us */}
                <div className="bg-background/50 rounded-2xl p-6 border border-border/30">
                  <h3 className="text-xl font-semibold mb-4">Why Contact Us?</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Free consultation for your project needs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Expert team with 3+ successful deliveries</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">Customized solutions for your business</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">24/7 support for active projects</span>
                    </li>
                  </ul>
                </div>

                {/* Social Links */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                  <div className="flex justify-center gap-4">
                    <a
                      href="https://wa.me/916369884331"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center hover:bg-green-500/30 transition-colors group"
                    >
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.058-.371-.025-.521-.075-.149-.669-1.611-.916-1.996-.243-.381-.495-.299-.673-.305-.173-.006-.371-.009-.57-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.122-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <a
                      href="mailto:prakash7418r@gmail.com"
                      className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 transition-colors group"
                    >
                      <Mail size={20} className="text-blue-500" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get in <span className="text-primary">Touch</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  content: "prakash7418r@gmail.com",
                  description: "Send us an email anytime",
                  href: "mailto:prakash7418r@gmail.com"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: "+91 6369884331",
                  description: "Mon-Sat from 9am to 6pm",
                  href: "tel:+916369884331"
                },
                {
                  icon: MapPin,
                  title: "Visit Us",
                  content: "Palacode, Dharamapuri",
                  description: "Tamil Nadu, India",
                  href: "#"
                }
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-xl bg-background/50 border border-border/30 hover:bg-background/80 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <a href={item.href} className="text-lg text-primary font-medium mb-2 block hover:underline">
                    {item.content}
                  </a>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our services and process.
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "What services do you offer?",
                  answer: "We offer custom web development, mobile app development, SaaS platforms, automation solutions, and API development. We work with startups to enterprises."
                },
                {
                  question: "How long does a typical project take?",
                  answer: "Project timelines vary based on complexity. A simple website might take 2-4 weeks, while a complex SaaS platform could take 3-6 months. We provide detailed timelines during consultation."
                },
                {
                  question: "What is your pricing structure?",
                  answer: "We offer flexible pricing models including fixed-price projects, hourly rates, and long-term retainers. Pricing depends on project scope, complexity, and timeline requirements."
                },
                {
                  question: "Do you provide ongoing support?",
                  answer: "Yes, we offer comprehensive support packages including maintenance, updates, bug fixes, and feature enhancements. Support plans are customized to your needs."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background/50 border border-border/30 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-3 text-primary">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
