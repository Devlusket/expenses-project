// 'use client';

// import { useEffect, useState } from 'react';
// import { Despesa } from '@/types/Despesa';

// export default function Home() {
//   const [despesas, setDespesas] = useState<Despesa[]>([]);
//   const [novaDescricao, setNovaDescricao] = useState('');
//   const [novoValor, setNovoValor] = useState('');
//   const [mensagem, setMensagem] = useState('');
//   const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error'>('success');
//   const [modoEscuro, setModoEscuro] = useState(false);
//   const [exibirPagas, setExibirPagas] = useState(true);

//   const fetchDespesas = async () => {
//     const res = await fetch('/api/despesas');
//     const data: Despesa[] = await res.json();
//     setDespesas(data);
//   };

//   const adicionarDespesa = async () => {
//     if (!novaDescricao.trim() || !novoValor.trim() || isNaN(Number(novoValor))) {
//       setMensagem('Preencha a descrição e um valor válido!');
//       setTipoMensagem('error');
//       return;
//     }

//     const novaDespesa: Despesa = {
//       id: Date.now().toString(),
//       descricao: novaDescricao,
//       valor: parseFloat(novoValor),
//       pago: false,
//       data: new Date().toISOString().split('T')[0],
//     };

//     await fetch('/api/despesas', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(novaDespesa),
//     });

//     setNovaDescricao('');
//     setNovoValor('');
//     setMensagem('Despesa adicionada com sucesso!');
//     setTipoMensagem('success');
//     fetchDespesas();
//   };

//   const togglePago = (id: string) => {
//     const atualizadas = despesas.map((d) =>
//       d.id === id ? { ...d, pago: !d.pago } : d
//     );
//     setDespesas(atualizadas);
//     atualizarDespesas(atualizadas);
//   };

//   const atualizarDespesas = async (despesasAtualizadas: Despesa[]) => {
//     await fetch('/api/despesas', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(despesasAtualizadas),
//     });
//   };

//   const deletarSelecionadas = async () => {
//     const idsParaDeletar = despesas.filter(d => d.pago).map(d => d.id);
//     if (idsParaDeletar.length === 0) {
//       setMensagem('Nenhuma despesa marcada para excluir.');
//       setTipoMensagem('error');
//       return;
//     }

//     await fetch('/api/despesas', {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ idsParaDeletar }),
//     });

//     const restantes = despesas.filter(d => !d.pago);
//     setDespesas(restantes);
//     setMensagem('Despesas excluídas com sucesso!');
//     setTipoMensagem('success');
//   };

//   const despesasFiltradas = despesas.filter(despesa => exibirPagas || !despesa.pago);

//   const total = despesasFiltradas.reduce((acc, d) => acc + d.valor, 0);

//   useEffect(() => {
//     fetchDespesas();
//     const isDark = document.documentElement.classList.contains('dark');
//     setModoEscuro(isDark);
//   }, []);

//   const alternarModo = () => {
//     const root = document.documentElement;
//     root.classList.toggle('dark');
//     setModoEscuro(root.classList.contains('dark'));
//   };

//   return (
//     <div className={`${modoEscuro ? 'bg-gray-900' : 'bg-gray-200'} min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 transition-colors`}>
//       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
//         <button
//           onClick={alternarModo}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all"
//         >
//           {modoEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
//         </button>
//       </div>
  
//       <div className={`${modoEscuro ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} w-full max-w-2xl rounded-lg shadow-xl p-4 sm:p-6 transition-colors duration-300`}>
//         <h1 className={`${modoEscuro ? 'text-indigo-400' : 'text-indigo-600'} text-2xl sm:text-3xl font-bold mb-4 text-center`}>
//           💸 App de Despesas
//         </h1>
  
//         {mensagem && (
//           <p className={`mb-4 font-medium ${tipoMensagem === 'error' 
//             ? (modoEscuro ? 'text-red-400' : 'text-red-600') 
//             : (modoEscuro ? 'text-green-400' : 'text-green-600')}`}>
//             {mensagem}
//           </p>
//         )}
  
//         {/* Exibindo o total de despesas */}
//         <div className="mb-4 text-lg sm:text-xl font-semibold text-center">
//           Total de Despesas: <span className={modoEscuro ? 'text-green-400' : 'text-green-600'}>
//             R$ {total.toFixed(2)}
//           </span>
//         </div>

//         {/* Opção para filtrar despesas pagas */}
//         <div className="flex justify-center mb-6">
//           <button
//             onClick={() => setExibirPagas(!exibirPagas)}
//             className={`px-4 py-2 rounded-lg transition-all duration-200 ${exibirPagas ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
//           >
//             {exibirPagas ? 'Ocultar Despesas Pagas' : 'Exibir Todas as Despesas'}
//           </button>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 mb-6">
//           <input
//             type="text"
//             value={novaDescricao}
//             onChange={(e) => setNovaDescricao(e.target.value)}
//             placeholder="Descrição da despesa"
//             className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
//           />
//           <input
//             type="number"
//             value={novoValor}
//             onChange={(e) => setNovoValor(e.target.value)}
//             placeholder="Valor da despesa"
//             className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
//           />
//           <button
//             onClick={adicionarDespesa}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
//           >
//             Adicionar
//           </button>
//         </div>
  
//         <h2 className="text-lg sm:text-xl font-semibold mb-2">Minhas Despesas</h2>
//         <ul className="space-y-2 mb-4">
//           {despesasFiltradas.map((despesa) => (
//             <li key={despesa.id} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={despesa.pago}
//                 onChange={() => togglePago(despesa.id)}
//                 className="h-5 w-5 text-indigo-600 border-gray-300 rounded dark:border-gray-600"
//               />
//               <span className={`text-base sm:text-lg ${despesa.pago 
//                 ? (modoEscuro ? 'line-through text-gray-500' : 'line-through text-gray-400') 
//                 : (modoEscuro ? 'text-gray-100' : 'text-gray-800')}`}>
//                 {despesa.descricao} - R$ {despesa.valor.toFixed(2)} - {despesa.data}
//               </span>
//             </li>
//           ))}
//         </ul>
  
//         <button
//           onClick={deletarSelecionadas}
//           className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-200"
//         >
//           🗑 Deletar Selecionadas
//         </button>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { Despesa } from '@/types/Despesa';

// export default function Home() {
//   const [despesas, setDespesas] = useState<Despesa[]>([]);
//   const [novaDescricao, setNovaDescricao] = useState('');
//   const [novoValor, setNovoValor] = useState('');
//   const [novaData, setNovaData] = useState(() => new Date().toISOString().split('T')[0]);
//   const [mensagem, setMensagem] = useState('');
//   const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error'>('success');
//   const [modoEscuro, setModoEscuro] = useState(false);
//   const [exibirPagas, setExibirPagas] = useState(true);

//   const fetchDespesas = async () => {
//     const res = await fetch('/api/despesas');
//     const data: Despesa[] = await res.json();
//     setDespesas(data);
//   };

//   const adicionarDespesa = async () => {
//     if (!novaDescricao.trim() || !novoValor.trim() || isNaN(Number(novoValor)) || !novaData) {
//       setMensagem('Preencha a descrição, valor válido e a data!');
//       setTipoMensagem('error');
//       return;
//     }

//     const novaDespesa: Despesa = {
//       id: Date.now().toString(),
//       descricao: novaDescricao,
//       valor: parseFloat(novoValor),
//       pago: false,
//       data: novaData,
//     };

//     await fetch('/api/despesas', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(novaDespesa),
//     });

//     setNovaDescricao('');
//     setNovoValor('');
//     setNovaData(new Date().toISOString().split('T')[0]);
//     setMensagem('Despesa adicionada com sucesso!');
//     setTipoMensagem('success');
//     fetchDespesas();
//   };

//   const togglePago = (id: string) => {
//     const atualizadas = despesas.map((d) =>
//       d.id === id ? { ...d, pago: !d.pago } : d
//     );
//     setDespesas(atualizadas);
//     atualizarDespesas(atualizadas);
//   };

//   const atualizarDespesas = async (despesasAtualizadas: Despesa[]) => {
//     await fetch('/api/despesas', {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(despesasAtualizadas),
//     });
//   };

//   const deletarSelecionadas = async () => {
//     const idsParaDeletar = despesas.filter(d => d.pago).map(d => d.id);
//     if (idsParaDeletar.length === 0) {
//       setMensagem('Nenhuma despesa marcada para excluir.');
//       setTipoMensagem('error');
//       return;
//     }

//     await fetch('/api/despesas', {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ idsParaDeletar }),
//     });

//     const restantes = despesas.filter(d => !d.pago);
//     setDespesas(restantes);
//     setMensagem('Despesas excluídas com sucesso!');
//     setTipoMensagem('success');
//   };

//   const despesasFiltradas = despesas.filter(despesa => exibirPagas || !despesa.pago);

//   const total = despesasFiltradas.reduce((acc, d) => acc + d.valor, 0);

//   useEffect(() => {
//     fetchDespesas();
//     const isDark = document.documentElement.classList.contains('dark');
//     setModoEscuro(isDark);
//   }, []);

//   const alternarModo = () => {
//     const root = document.documentElement;
//     root.classList.toggle('dark');
//     setModoEscuro(root.classList.contains('dark'));
//   };

//   return (
//   <div className={`${modoEscuro ? 'bg-gray-900' : 'bg-gray-200'} min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 transition-colors`}>
//     <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
//       <button
//         onClick={alternarModo}
//         className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all"
//       >
//         {modoEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
//       </button>
//     </div>

//     <div className={`${modoEscuro ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} w-full max-w-2xl rounded-lg shadow-xl p-4 sm:p-6 transition-colors duration-300`}>
//       <h1 className={`${modoEscuro ? 'text-indigo-400' : 'text-indigo-600'} text-2xl sm:text-3xl font-bold mb-4 text-center`}>
//         💸 App de Despesas
//       </h1>

//       {mensagem && (
//         <p className={`mb-4 font-medium text-center ${tipoMensagem === 'error' 
//           ? (modoEscuro ? 'text-red-400' : 'text-red-600') 
//           : (modoEscuro ? 'text-green-400' : 'text-green-600')}`}>
//           {mensagem}
//         </p>
//       )}

//       <div className="mb-4 text-lg sm:text-xl font-semibold text-center">
//         Total de Despesas: <span className={modoEscuro ? 'text-green-400' : 'text-green-600'}>
//           R$ {total.toFixed(2)}
//         </span>
//       </div>

//       <div className="flex justify-center mb-6">
//         <button
//           onClick={() => setExibirPagas(!exibirPagas)}
//           className={`px-4 py-2 rounded-lg transition-all duration-200 ${exibirPagas ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
//         >
//           {exibirPagas ? 'Ocultar Despesas Pagas' : 'Exibir Todas as Despesas'}
//         </button>
//       </div>

//       {/* Inputs + botão "Adicionar" em nova linha */}
//       <div className="flex flex-col gap-2 mb-6">
//         <div className="flex flex-col sm:flex-row gap-2">
//           <input
//             type="text"
//             value={novaDescricao}
//             onChange={(e) => setNovaDescricao(e.target.value)}
//             placeholder="Descrição da despesa"
//             className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
//           />
//           <input
//             type="number"
//             value={novoValor}
//             onChange={(e) => setNovoValor(e.target.value)}
//             placeholder="Valor da despesa"
//             className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
//           />
//           <input
//             type="date"
//             value={novaData}
//             onChange={(e) => setNovaData(e.target.value)}
//             className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
//               modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'
//             }`}
//           />
//         </div>

//         <div className="flex justify-center">
//           <button
//             onClick={adicionarDespesa}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
//           >
//             ➕ Adicionar
//           </button>
//         </div>
//       </div>

//       <h2 className="text-lg sm:text-xl font-semibold mb-2">Minhas Despesas</h2>
//       <ul className="space-y-2 mb-4">
//         {despesasFiltradas.map((despesa) => (
//           <li key={despesa.id} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={despesa.pago}
//               onChange={() => togglePago(despesa.id)}
//               className="h-5 w-5 text-indigo-600 border-gray-300 rounded dark:border-gray-600"
//             />
//             <span className={`text-base sm:text-lg ${despesa.pago 
//               ? (modoEscuro ? 'line-through text-gray-500' : 'line-through text-gray-400') 
//               : (modoEscuro ? 'text-gray-100' : 'text-gray-800')}`}>
//               {/* {despesa.descricao} - R$ {despesa.valor.toFixed(2)} - {despesa.data} */}
//               {despesa.descricao} - R$ {despesa.valor.toFixed(2)} - {new Date(despesa.data).toLocaleDateString('pt-BR')}

//             </span>
//           </li>
//         ))}
//       </ul>

//       <button
//         onClick={deletarSelecionadas}
//         className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-200"
//       >
//         🗑 Deletar Selecionadas
//       </button>
//     </div>
//   </div>
// );
// }


'use client';

import { useEffect, useState } from 'react';
import { Despesa } from '@/types/Despesa';

export default function Home() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');
  const [novaData, setNovaData] = useState(() => new Date().toISOString().split('T')[0]);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState<'success' | 'error'>('success');
  const [modoEscuro, setModoEscuro] = useState(false);
  const [exibirPagas, setExibirPagas] = useState(true);

  const fetchDespesas = async () => {
    const res = await fetch('/api/despesas');
    const data: Despesa[] = await res.json();
    // Converter valor para number, pois Prisma retorna Decimal
    const despesasConvertidas = data.map(d => ({
      ...d,
      valor: Number(d.valor)
    }));
    setDespesas(despesasConvertidas);
  };

  const adicionarDespesa = async () => {
    if (!novaDescricao.trim() || !novoValor.trim() || isNaN(Number(novoValor)) || !novaData) {
      setMensagem('Preencha a descrição, valor válido e a data!');
      setTipoMensagem('error');
      return;
    }

    const novaDespesa: Despesa = {
      id: Date.now().toString(),
      descricao: novaDescricao,
      valor: parseFloat(novoValor),
      pago: false,
      data: novaData,
    };

    await fetch('/api/despesas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaDespesa),
    });

    setNovaDescricao('');
    setNovoValor('');
    setNovaData(new Date().toISOString().split('T')[0]);
    setMensagem('Despesa adicionada com sucesso!');
    setTipoMensagem('success');
    fetchDespesas();
  };

  const togglePago = (id: string) => {
    const atualizadas = despesas.map((d) =>
      d.id === id ? { ...d, pago: !d.pago } : d
    );
    setDespesas(atualizadas);
    atualizarDespesas(atualizadas);
  };

  const atualizarDespesas = async (despesasAtualizadas: Despesa[]) => {
    await fetch('/api/despesas', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(despesasAtualizadas),
    });
  };

  const deletarSelecionadas = async () => {
    const idsParaDeletar = despesas.filter(d => d.pago).map(d => d.id);
    if (idsParaDeletar.length === 0) {
      setMensagem('Nenhuma despesa marcada para excluir.');
      setTipoMensagem('error');
      return;
    }

    await fetch('/api/despesas', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idsParaDeletar }),
    });

    const restantes = despesas.filter(d => !d.pago);
    setDespesas(restantes);
    setMensagem('Despesas excluídas com sucesso!');
    setTipoMensagem('success');
  };

  const despesasFiltradas = despesas.filter(despesa => exibirPagas || !despesa.pago);

  // Garantir que 'valor' seja number antes de reduzir
  const total = despesasFiltradas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0);

  useEffect(() => {
    fetchDespesas();
    const isDark = document.documentElement.classList.contains('dark');
    setModoEscuro(isDark);
  }, []);

  const alternarModo = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setModoEscuro(root.classList.contains('dark'));
  };

  return (
    <div className={`${modoEscuro ? 'bg-gray-900' : 'bg-gray-200'} min-h-screen flex items-center justify-center py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 transition-colors`}>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <button
          onClick={alternarModo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all"
        >
          {modoEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      <div className={`${modoEscuro ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} w-full max-w-2xl rounded-lg shadow-xl p-4 sm:p-6 transition-colors duration-300`}>
        <h1 className={`${modoEscuro ? 'text-indigo-400' : 'text-indigo-600'} text-2xl sm:text-3xl font-bold mb-4 text-center`}>
          💸 App de Despesas
        </h1>

        {mensagem && (
          <p className={`mb-4 font-medium text-center ${tipoMensagem === 'error' 
            ? (modoEscuro ? 'text-red-400' : 'text-red-600') 
            : (modoEscuro ? 'text-green-400' : 'text-green-600')}`}>
            {mensagem}
          </p>
        )}

        <div className="mb-4 text-lg sm:text-xl font-semibold text-center">
          Total de Despesas: <span className={modoEscuro ? 'text-green-400' : 'text-green-600'}>
            R$ {total.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setExibirPagas(!exibirPagas)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${exibirPagas ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          >
            {exibirPagas ? 'Ocultar Despesas Pagas' : 'Exibir Todas as Despesas'}
          </button>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              placeholder="Descrição da despesa"
              className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            <input
              type="number"
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              placeholder="Valor da despesa"
              className={`flex-1 border ${modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
            />
            <input
              type="date"
              value={novaData}
              onChange={(e) => setNovaData(e.target.value)}
              className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                modoEscuro ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'
              }`}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={adicionarDespesa}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
            >
              ➕ Adicionar
            </button>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-2">Minhas Despesas</h2>
        <ul className="space-y-2 mb-4">
          {despesasFiltradas.map((despesa) => (
            <li key={despesa.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={despesa.pago}
                onChange={() => togglePago(despesa.id)}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded dark:border-gray-600"
              />
              <span className={`text-base sm:text-lg ${despesa.pago 
                ? (modoEscuro ? 'line-through text-gray-500' : 'line-through text-gray-400') 
                : (modoEscuro ? 'text-gray-100' : 'text-gray-800')}`}>
                {despesa.descricao} - R$ {Number(despesa.valor).toFixed(2)} - {new Date(despesa.data).toLocaleDateString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={deletarSelecionadas}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-200"
        >
          🗑 Deletar Selecionadas
        </button>
      </div>
    </div>
  );
}
