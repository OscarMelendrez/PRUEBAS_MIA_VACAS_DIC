"use client"
import { useState, useRef } from "react";

const Principal = () => {
    //===================== VARIABLES DE ESTADOS ======================
    const fileInputRef = useRef(null);

    // Entrada de comandos
    const [comando, setComando] = useState('');

    // Salida de comandos
    const [salida, setSalida] = useState('');

    // Archivo seleccionado
    const [nombreArchivo, setNombreArchivo] = useState("");

    // Estado de carga
    const [cargando, setCargando] = useState(false);

    //===================== FUNCIONES ==============================

    // Función para enviar los datos al Backend CORREGIDA
    async function onPost() {
        if (!comando.trim()) {
            setSalida("❌ Error: No hay comando para ejecutar");
            return;
        }

        setCargando(true);
        setSalida("⏳ Ejecutando comando...");

        try {
            const response = await fetch(`http://localhost:3000/GoDisk/commands`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // IMPORTANTE: Enviar como objeto JSON con la propiedad "Comandos"
                body: JSON.stringify({
                    Comandos: comando
                })
            });

            // Obtener la respuesta como texto primero para debugging
            const responseText = await response.text();
            
            let datos;
            try {
                datos = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                console.log("Raw response:", responseText);
                throw new Error("Respuesta inválida del servidor");
            }

            if (!response.ok) {
                throw new Error(datos.error || `Error ${response.status}: ${responseText}`);
            }

            // Mostrar la respuesta formateada
            if (datos.success) {
                // Si hay datos, mostrarlos formateados
                if (datos.data) {
                    const salidaFormateada = `✅ Comando ejecutado exitosamente\n\n📊 Resultado:\n${JSON.stringify(datos.data, null, 2)}\n\n${datos.totalErrores > 0 ? `⚠️ Errores: ${datos.totalErrores}\n` : ''}`;
                    setSalida(salidaFormateada);
                } else {
                    setSalida(`✅ ${datos.message || "Comando ejecutado"}`);
                }
            } else {
                setSalida(`❌ Error: ${datos.error || "Error desconocido"}`);
            }

            console.log("Respuesta del servidor:", datos);

        } catch (ex) {
            console.error(`Error: ${ex}`);
            setSalida(`❌ Error: ${ex.message || "Error de conexión con el servidor"}`);
        } finally {
            setCargando(false);
        }
    }

    // Función para ingresar comandos al text area CORREGIDA
    const onChangeCommandos = (e) => {
        setComando(e.target.value);
        console.log("Comando actual:", e.target.value);
    }

    // Función para seleccionar los archivos
    const handleFileSelect = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            // Verificar que sea archivo de texto
            if (!archivo.type.includes('text/') && !archivo.name.endsWith('.txt')) {
                setSalida("❌ Error: Solo se permiten archivos de texto (.txt)");
                return;
            }

            setNombreArchivo(archivo.name);

            const lector = new FileReader();
            lector.onload = (evento) => {
                setComando(evento.target.result);
                setSalida(`📁 Archivo cargado: ${archivo.name}`);
            };
            lector.onerror = () => {
                setSalida("❌ Error al leer el archivo");
            };
            lector.readAsText(archivo);
        }
        e.target.value = null;
    };

    // Función para limpiar las areas de texto
    const handleClear = () => {
        setComando('');
        setSalida('');
        setNombreArchivo('');
        setCargando(false);
    };

    // Función para manejar Ctrl+Enter
    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            onPost();
        }
    };

    return (
        <div className="min-h-screen bg-red-900 dark:bg-red-900 p-4" style={{ width: '100vw' }}>
            <div className="max-w-4xl mx-auto">
                {/* input de archivos */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".txt,.text/plain"
                />

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-red-100 mb-1">GoDisk</h1>
                    <p className="text-red-300 text-sm">Interfaz de comandos del sistema de archivos</p>
                    <div className="mt-2 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cargando ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        <span className="text-xs text-red-200">
                            {cargando ? 'Conectando al servidor...' : 'Servidor listo: http://localhost:3000'}
                        </span>
                    </div>
                </div>

                {/* Barra de Control */}
                <div className="bg-red-950 rounded-t-lg p-3 flex gap-2 flex-wrap border border-red-300">
                    <button
                        onClick={handleFileSelect}
                        className="bg-red-600 text-red-300 hover:bg-red-700 h-12 px-4 rounded font-medium transition-colors disabled:opacity-50"
                        disabled={cargando}
                    >
                        📁 Elegir archivo
                    </button>
                    
                    {nombreArchivo && (
                        <div className="flex items-center">
                            <span className="text-red-300 text-sm bg-red-800 px-3 py-2 rounded">
                                📄 {nombreArchivo}
                            </span>
                        </div>
                    )}

                    <div className="flex-1"></div>
                    
                    <button
                        onClick={onPost}
                        disabled={cargando || !comando.trim()}
                        className="bg-red-800 text-red-300 hover:bg-red-900 h-12 px-6 rounded border border-red-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {cargando ? (
                            <>
                                <span className="animate-spin">⟳</span> Ejecutando...
                            </>
                        ) : (
                            '🚀 Ejecutar'
                        )}
                    </button>
                    
                    <button
                        onClick={handleClear}
                        disabled={cargando}
                        className="bg-red-600 text-red-300 hover:bg-red-800 h-12 px-4 rounded font-medium transition-colors disabled:opacity-50"
                    >
                        🗑️ Limpiar
                    </button>
                </div>

                {/* Sección de Entrada */}
                <div className="bg-red-950 border border-red-300 border-t-0 border-b-0 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-red-200">Entrada</span>
                            <span className="text-xs text-red-200 bg-red-900 px-2 py-1 rounded">
                                {comando.split('\n').length} líneas
                            </span>
                        </div>
                        <span className="text-xs text-red-400">
                            💡 Presiona Ctrl+Enter para ejecutar
                        </span>
                    </div>
                    <textarea
                        name="command"
                        id="command"
                        placeholder="Ingresa tu comando aquí...\nEjemplo: mkdisk -size=1024 -unit=M -path=/disco.dsk\n\nPara múltiples comandos, sepáralos por líneas."
                        className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-700 resize-none focus:outline-none focus:border-red-500"
                        value={comando}
                        onChange={onChangeCommandos}
                        onKeyDown={handleKeyDown}
                        disabled={cargando}
                    />
                    <div className="mt-2 text-xs text-red-400">
                        <p>📝 Caracteres: {comando.length} | Líneas: {comando.split('\n').length}</p>
                    </div>
                </div>

                {/* Sección de Salida */}
                <div className="bg-red-950 border border-red-300 border-t-0 rounded-b-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-red-200">Salida</span>
                        <span className="text-xs text-red-200 bg-red-900 px-2 py-1 rounded">
                            {salida ? 'Con datos' : 'Vacío'}
                        </span>
                    </div>
                    <pre className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-3 rounded border border-gray-700 overflow-auto whitespace-pre-wrap">
                        {salida || "La salida de los comandos aparecerá aquí..."}
                    </pre>
                    
                    {salida && (
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(salida);
                                    alert('Salida copiada al portapapeles');
                                }}
                                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700"
                            >
                                📋 Copiar salida
                            </button>
                            <button
                                onClick={() => {
                                    const blob = new Blob([salida], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'salida_godisk.txt';
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded hover:bg-gray-700"
                            >
                                💾 Descargar salida
                            </button>
                        </div>
                    )}
                </div>

                {/* Información de comandos comunes */}
                <div className="mt-6 bg-red-950 border border-red-300 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-red-200 mb-3">📚 Comandos comunes:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-red-900 p-3 rounded">
                            <code className="text-green-300 text-sm">mkdisk -size=1024 -unit=M -path=disco.dsk</code>
                            <p className="text-red-300 text-xs mt-1">Crear un nuevo disco</p>
                        </div>
                        <div className="bg-red-900 p-3 rounded">
                            <code className="text-green-300 text-sm">rmdisk -path=disco.dsk</code>
                            <p className="text-red-300 text-xs mt-1">Eliminar disco</p>
                        </div>
                        <div className="bg-red-900 p-3 rounded">
                            <code className="text-green-300 text-sm">fdisk -size=200 -path=disco.dsk -name=Particion1</code>
                            <p className="text-red-300 text-xs mt-1">Crear partición</p>
                        </div>
                        <div className="bg-red-900 p-3 rounded">
                            <code className="text-green-300 text-sm">mount -path=disco.dsk -name=Particion1</code>
                            <p className="text-red-300 text-xs mt-1">Montar partición</p>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-red-300 text-xs">
                    <p>202308486 - Oscar Danilo Melendrez Marroquin - MIAVAC2S2025</p>
                    <p className="mt-1">Backend corriendo en: http://localhost:3000/GoDisk/commands</p>
                </div>
            </div>
        </div>
    )
}

export default Principal