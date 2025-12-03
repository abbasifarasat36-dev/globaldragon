import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface Bubble {
    id: number;
    style: React.CSSProperties;
}

const BubbleCollector: React.FC = () => {
    const { bubbleAnimationTrigger } = useApp();
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        if (bubbleAnimationTrigger) {
            const { count } = bubbleAnimationTrigger;
            // Create a reasonable number of bubbles for the animation, not 1 per coin
            const bubblesToCreate = Math.min(Math.ceil(count / 5), 30); 

            const newBubbles: Bubble[] = Array.from({ length: bubblesToCreate }).map((_, i) => ({
                id: Date.now() + i,
                style: {
                    left: `${Math.random() * 90 + 5}%`,
                    animationDuration: `${5 + Math.random() * 3}s`, // Slower, calmer animation
                    animationDelay: `${Math.random()}s`,
                    transform: `scale(${0.7 + Math.random() * 0.6})`,
                },
            }));
            setBubbles(prev => [...prev, ...newBubbles]);
        }
    }, [bubbleAnimationTrigger]);

    const handleAnimationEnd = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
                {bubbles.map(bubble => (
                    <div
                        key={bubble.id}
                        className="bubble"
                        style={bubble.style}
                        onAnimationEnd={() => handleAnimationEnd(bubble.id)}
                    />
                ))}
            </div>
            <style>{`
                .bubble {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), var(--primary) 90%);
                    box-shadow: 0 0 10px var(--glow-1), inset 0 0 5px rgba(255, 255, 255, 0.5);
                    position: absolute;
                    bottom: -50px;
                    animation-name: float-up-and-fade;
                    animation-timing-function: ease-in-out;
                    animation-fill-mode: forwards;
                }
                @keyframes float-up-and-fade {
                    from {
                        bottom: -50px;
                        opacity: 1;
                    }
                    50% {
                         opacity: 0.9;
                    }
                    to {
                        bottom: 90%;
                        opacity: 0;
                    }
                }
            `}</style>
        </>
    );
};

export default BubbleCollector;