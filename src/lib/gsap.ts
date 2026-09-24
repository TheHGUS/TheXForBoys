import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Slightly snappy global defaults. Nothing floaty.
gsap.defaults({ ease: 'power3.out', duration: 0.6 });

export { gsap, ScrollTrigger };
