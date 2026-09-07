import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 select-none no-print">
      {/* Barra de menú de ventana estilo Desktop App (File, Edit, View, Window, Help) */}
      <div className="bg-[#1e232a] text-slate-300 text-[11px] px-3 py-1 flex items-center gap-4 font-normal">
        <span className="hover:text-white cursor-default">File</span>
        <span className="hover:text-white cursor-default">Edit</span>
        <span className="hover:text-white cursor-default">View</span>
        <span className="hover:text-white cursor-default">Window</span>
        <span className="hover:text-white cursor-default">Help</span>
      </div>

      {/* Cabecera Principal con Logotipo Oficial */}
      <div className="h-14 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-12 flex items-center justify-center">
            <img
              src="/sai_logo_emblem.png"
              alt="Logo SAI Consult"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-[#0f2942] text-lg font-heading leading-tight">
              SAI Consult
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Servicios Aeronáuticos Integrales
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
