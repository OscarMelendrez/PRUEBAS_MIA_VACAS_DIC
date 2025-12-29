"use client"
import { useState, useRef } from "react";
import Service from "../service/Service";

const Principal = () => {

//===================== VARIABLES DE ESTADOS ======================
    //Referencia para la apertura de archivos
    const fileInputRef = useRef(null);

    //entrada de comandos
    const [comandos, setComandos] = useState ({
            command: '',
        })

    //salida de comandos
    const [salidas, setSalidas] = useState ({
        output: '',
    })

    //archivo seleccionado
    const [nombreArchivo, setNombreArchivo] = useState("");

//===================== FUNCIONES ==============================
    //funcion para enviar los datos al Backend
    async function onPost() {
        var puerto = 3000

        try {
            const response = await fetch(`http://localHost:${puerto}/GoDisk/commands`, 
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: comandos.command
            }
         );


            if (!response.ok) throw new Error(`Error en la peticion`)
                
            var salidaS = await response.json();
            console.log(salidaS)
            salidas.output = salidaS
            setSalidas(salidaS.data)
            
        } 
        catch (ex) {
            console.log(`Error: ${ex}`)
            alert(ex)
        }
        
    }

    // Funcion para ingresar comandos al text area
    const onChangeCommandos = (e) => {
        setComandos({
            ...command,
            [e.target.name]: e.target.value
        })
        console.log(comandos);
    }

    //Funcion para seleccionar los archivos
    const handleFileSelect = () => {    
        fileInputRef.current.click()
    }

const handleFileChange = (e) => {
        const archivo = e.target.files[0];
        if (archivo) {
            // Actualizamos el nombre aquí
            setNombreArchivo(archivo.name);

            const lector = new FileReader();
            lector.onload = (evento) => {
                setComandos({ ...comandos, command: evento.target.result });
            };
            lector.readAsText(archivo);
        } else {
            alert('Tipo de archivo no aceptado')
        }
        e.target.value = null;
    };

    //Funcion para limpiar las areas de texto
    const handleClear = () => {
        setComandos({command: ''});
        setSalidas({output: ''});
        setNombreArchivo('')
    };

    return (
        <div className="min-h-screen bg-red-900 dark:bg-red-900 p-4" style={{width: '100vw'}} >
        <div className="max-w-4xl mx-auto" >

            {/* input de archivos */}
            <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".txt" 
            />

            {/* Header */}
            <div className="mb-6">
            <h1 className="text-3xl font-bold text-red-100 mb-1">GoDisk</h1>
            </div>

            {/* Barra de Control */}
            <div className="bg-red-950 rounded-t-lg p-3 flex gap-2 flex-wrap border border-red-300">
            <button
                onClick={handleFileSelect}
                className="bg-red-600 text-red-300 hover:bg-red-700 h-12 text-xs px-3 rounded font-medium"
            >
                Elegir archivo
            </button>
            <par
                className="bg-red-950 text-red-300 hover:bg-red-700 text-l px-5 rounded font-black h-auto bg-center"
            >
                {nombreArchivo}
            </par>

            <div className="flex-1"></div>
            <button
                onClick={onPost}
                className="bg-red-800 text-red-300 hover:bg-red-900 h-12 text-xs rounded border border-red-600 font-medium"
            >
                Ejecutar
            </button>
            <button
                onClick={handleClear}
                className="bg-red-600 text-red-300 hover:bg-red-800 h-12 text-xs px-3 rounded font-medium"
            >
                Limpiar
            </button>
            </div>

            {/* Seccion de Entrada */}
            <div className="bg-red-950 border border-red-300 border-t-0 border-b-0 p-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-red-200">Entrada</span>
                <span className="text-xs text-red-200 bg-red-900 px-2 py-1 rounded">1</span>
            </div>
            <textarea
                type="command"
                name="command"
                id="command"
                placeholder="Enter your command here..."
                className="w-full h-55 bg-gray-800 text-green-400 font-mono text-sm p-3 rounded border border-gray-700 resize-none"
                value={comandos.command}
                onChange={onChangeCommandos}
            />
            </div>

            {/* Seccion de Salida */}
            <div className="bg-red-950 border border-red-300 border-t-0 rounded-b-lg p-4">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-red-200">Salida</span>
                <span className="text-xs text-red-200 bg-red-900 px-2 py-1 rounded">1</span>
            </div>
            <textarea className="w-full h-55 bg-gray-800 text-green-400 font-mono text-sm p-3 rounded border border-gray-700 overflow-auto whitespace-pre-wrap wrap-break-word"
                value={salidas.output}
                placeholder="Commands output..."
                readOnly
                />
                
            </div>

            {/* Footer Info */}
            <div className="mt-4 text-center text-red-600 text-xs">
            <p>202308486 - Oscar Danilo Melendrez Marroquin - MIAVAC2S2025</p>
            </div>
        </div>
        </div>
    )
}

export default Principal
