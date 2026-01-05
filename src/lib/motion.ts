export const transitions = {
    spring: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
    },
    smooth: {
        type: "tween",
        ease: [0.25, 0.46, 0.45, 0.94],
        duration: 0.6
    }
};

export const variants = {
    // Stagger Container
    container: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    },

    // Standard Fade Up
    fadeInUp: {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: transitions.spring
        }
    },

    // Scale In (for cards/images)
    scaleIn: {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: transitions.spring
        }
    },

    // Slide In from Left/Right (Timeline)
    slideInLeft: {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: transitions.smooth
        }
    },
    slideInRight: {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: transitions.smooth
        }
    },

    // Aurora Float Effect
    float: {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Pulse Glow
    glow: {
        initial: { opacity: 0.5, scale: 1 },
        animate: {
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }
};
