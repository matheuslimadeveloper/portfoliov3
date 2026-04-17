'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GithubLogo, LinkedinLogo } from 'phosphor-react';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/translations';
import { useConfig } from '@/lib/use-config';

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].team;

  const { config } = useConfig();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Title animation
    gsap.fromTo(titleRef.current,
      { y: 60, opacity: 0, filter: 'blur(10px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        }
      }
    );

    const cards = gridRef.current?.querySelectorAll('.team-card');
    if (cards) {
      gsap.fromTo(cards,
        { y: 60, opacity: 0, scale: 0.95, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.15,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
          }
        }
      );
    }

  }, []);

  return (
    <section id="team" ref={sectionRef} className="py-20 px-6 md:px-12 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title} <span className="glow-text">{t.titleHighlight}</span>
          </h2>
        </div>

        {/* Grid with automatic centering when there is only 1 member */}
        <div 
          ref={gridRef} 
          className={`grid gap-8 justify-items-center ${
            config.team.length === 1 
              ? 'grid-cols-1' 
              : config.team.length === 2
              ? 'md:grid-cols-2'
              : 'md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {config.team.map((member) => (
            <div 
              key={member.id}
              className="team-card group relative p-8 rounded-2xl border border-border/50 glass hover:border-primary/30 transition-all duration-300 hover:scale-105 max-w-md w-full"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Profile Image */}
                <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-all">
                  <img 
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-bold mb-2 glow-text-subtle">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-primary font-medium mb-4 uppercase tracking-wider text-sm">
                  {typeof member.role === 'string' ? member.role : member.role[language]}
                </p>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {typeof member.bio === 'string' ? member.bio : member.bio[language]}
                </p>

                {/* Social Links */}
                <div className="flex gap-4">
                  {member.social?.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <GithubLogo size={24} weight="fill" />
                    </a>
                  )}
                  {member.social?.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <LinkedinLogo size={24} weight="fill" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group relative px-8 py-4 rounded-full border-2 border-primary bg-primary/10 hover:bg-primary/20 transition-all duration-300 animate-pulse hover:animate-none hover:scale-105"
          >
            <span className="text-lg font-semibold glow-text">
              {t.cta}
            </span>
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;
