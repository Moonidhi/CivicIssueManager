export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-neutral-50 to-highlight-50 animate-gradient bg-[length:200%_200%]" />

      <div className="absolute inset-0 opacity-30">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A4D8F" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#3DDC97" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path
            d="M0,100 Q250,80 500,100 T1000,100 T1500,100 T2000,100 V200 H0 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
            style={{ transformOrigin: 'center' }}
          />
          <path
            d="M0,150 Q250,130 500,150 T1000,150 T1500,150 T2000,150 V200 H0 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
            style={{ transformOrigin: 'center', animationDelay: '0.5s' }}
          />
        </svg>
      </div>

      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary-200 to-highlight-200 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
