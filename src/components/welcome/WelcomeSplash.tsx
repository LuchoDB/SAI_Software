import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';

interface WelcomeSplashProps {
  onFinish: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onFinish }) => {
  // Estados de animación del logo completo:
  // 'enter': Logo aparece con fade-in y escala suave
  // 'active': Logo completo visible en su esplendor con destello sutil
  // 'exit': Desvanecimiento suave para dar paso inmediato al menú de trabajo
  const [stage, setStage] = useState<'enter' | 'active' | 'exit'>('enter');

  const handleSkip = useCallback(() => {
    setStage('exit');
    const timer = setTimeout(() => {
      onFinish();
    }, 250);
    return () => clearTimeout(timer);
  }, [onFinish]);

  useEffect(() => {
    // 1. Entrada suave del logo completo (100ms)
    const tEnter = setTimeout(() => {
      setStage('active');
    }, 100);

    // 2. Inicio de transición de salida (1800ms)
    const tExit = setTimeout(() => {
      setStage('exit');
    }, 1800);

    // 3. Carga directa del menú de trabajo (2200ms)
    const tFinish = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearTimeout(tEnter);
      clearTimeout(tExit);
      clearTimeout(tFinish);
    };
  }, [onFinish]);

  // Permitir omitir con cualquier tecla rápida (Escape, Espacio, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center select-none cursor-pointer transition-opacity duration-500 ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 48%, #ffffff 0%, #f8fafc 70%, #f1f5f9 100%)',
      }}
    >
      {/* Botón sutil en la esquina para omitir la animación */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-6 right-6 text-xs text-slate-400 hover:text-slate-700 bg-white/90 backdrop-blur-xs border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-2xs cursor-pointer z-10"
        title="Omitir presentación (Esc)"
      >
        <span>Omitir</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      {/* Contenedor central del Logo Completo */}
      <div className="relative flex flex-col items-center justify-center max-w-xl w-full px-6">
        <div
          className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${
            stage === 'enter'
              ? 'opacity-0 scale-90 translate-y-3 blur-[1px]'
              : stage === 'active'
              ? 'opacity-100 scale-100 translate-y-0 blur-0'
              : 'opacity-0 scale-105 -translate-y-2'
          }`}
        >
          {/* Logo Completo Oficial (Emblema + Servicios Aeronáuticos Integrados) */}
          <div className="relative overflow-hidden rounded-xl p-2">
            <img
              src="/sai_logo_full.png"
              alt="Servicios Aeronáuticos Integrados"
              className="w-full max-w-[520px] h-auto object-contain pointer-events-none select-none"
              style={{
                filter: 'drop-shadow(0 14px 28px rgba(15, 23, 42, 0.08))',
              }}
            />

            {/* Efecto de destello de luz diagonal sutil que cruza el logo completo */}
            <div
              className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-700 ${
                stage === 'active' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
            </div>
          </div>

          {/* Subtítulo institucional minimalista */}
          <div
            className={`mt-4 text-center transition-all duration-500 delay-150 ${
              stage === 'active' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-slate-400 uppercase">
              <span className="inline-block w-8 h-px bg-slate-200" />
              <span>Consultoría &amp; Ingeniería Aeronáutica</span>
              <span className="inline-block w-8 h-px bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Pie de versión de la aplicación de escritorio */}
      <div className="absolute bottom-5 text-center">
        <p className="text-[11px] text-slate-400 font-mono tracking-wider">
          SAI Consult Desktop Workstation • v1.0
        </p>
      </div>
    </div>
  );
};
