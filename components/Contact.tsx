import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GithubLogo } from 'phosphor-react';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/translations';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const form = formRef.current;
    const socials = socialsRef.current;

    if (!section || !title || !form || !socials) return;

    // Title animation
    gsap.fromTo(title,
      { y: 50, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        }
      }
    );

    // Form inputs animation
    const inputs = form.querySelectorAll('input, textarea, button');
    gsap.fromTo(inputs,
      { x: -50, opacity: 0, filter: 'blur(5px)' },
      {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
        }
      }
    );

    // Socials animation
    const socialIcons = socials.querySelectorAll('.social-icon');
    gsap.fromTo(socialIcons,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: socials,
          start: 'top 85%',
        }
      }
    );

  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Button pulse animation
    const btn = e.currentTarget.querySelector('button[type="submit"]');
    gsap.fromTo(btn,
      { scale: 1 },
      { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );

    const message = `*New Contact from Portfolio*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
    const whatsappUrl = `https://wa.me/351934827235?text=${message}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast.success(t.success);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen flex items-center py-20 px-6 md:px-12 relative">
      <div className="max-w-4xl mx-auto w-full">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-12 text-center">
          {t.title} <span className="glow-text">{t.titleHighlight}</span>
        </h2>

        <div className="glass rounded-2xl p-8 md:p-12 glow-border">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                name="name"
                placeholder={t.form.name}
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-secondary/50 border-border focus:border-primary transition-all focus:glow-border"
              />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder={t.form.email}
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-secondary/50 border-border focus:border-primary transition-all focus:glow-border"
              />
            </div>

            <div>
              <Textarea
                name="message"
                placeholder={t.form.message}
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="bg-secondary/50 border-border focus:border-primary transition-all focus:glow-border resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full glow-border transition-all hover:scale-105"
            >
              {t.form.send}
            </Button>
          </form>

          {/* Social Icons */}
          <div ref={socialsRef} className="flex justify-center gap-6 mt-12 pt-8 border-t border-border/50">
            <div className="text-center w-full mb-4">
              <p className="text-sm text-muted-foreground">
                {t.form.phone || 'Phone'}: <a href="tel:+351934827235" className="text-primary hover:underline">+351 934 827 235</a>
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/matheuslimadeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon w-12 h-12 rounded-full glass flex items-center justify-center hover:glow-border transition-all hover:scale-110 group"
            >
              <GithubLogo size={24} weight="light" className="group-hover:text-primary transition-colors" />
            </a>
            <a
              href="https://wa.me/351934827235"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon w-12 h-12 rounded-full glass flex items-center justify-center hover:glow-border transition-all hover:scale-110 group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:text-primary transition-colors">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default Contact;
