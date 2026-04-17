'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/translations';
import { useConfig } from '@/lib/use-config';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language].faq;

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

    // Accordion items animation
    gsap.fromTo(accordionRef.current?.children || [],
      { y: 40, opacity: 0, filter: 'blur(5px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: accordionRef.current,
          start: 'top 85%',
        }
      }
    );

  }, []);

  return (
    <section id="faq" ref={sectionRef} className="py-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title} <span className="glow-text">{t.titleHighlight}</span>
          </h2>
        </div>

        <div ref={accordionRef}>
          <Accordion type="single" collapsible className="space-y-4">
            {(config?.faq || []).map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={`item-${item.id}`}
                className="border border-border/50 rounded-lg px-6 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-lg font-medium hover:text-primary">
                  {typeof item.question === 'string' ? item.question : item.question[language]}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {typeof item.answer === 'string' ? item.answer : item.answer[language]}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
