package controllers

import (
	general "Proyecto/comandos/generales"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

// Handler principal para comandos
func HandleCommand(w http.ResponseWriter, r *http.Request) {
	// Configurar CORS
	setCORSHeaders(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		sendJSONError(w, "Método no permitido", http.StatusMethodNotAllowed, nil)
		return
	}

	// Decodificar el cuerpo JSON
	var requestBody struct {
		Comandos *string `json:"Comandos"`
	}

	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		sendJSONError(w, "JSON inválido", http.StatusBadRequest, err)
		return
	}

	if requestBody.Comandos == nil || strings.TrimSpace(*requestBody.Comandos) == "" {
		sendJSONError(w, "El campo 'Comandos' es obligatorio", http.StatusBadRequest, nil)
		return
	}

	// Procesar línea por línea
	comandosTexto := strings.TrimSpace(*requestBody.Comandos)
	lineas := strings.Split(comandosTexto, "\n")

	// Estructura para resultados
	resultados := []map[string]interface{}{}
	errores := []string{}
	comandosExitosos := 0
	comandosFallidos := 0

	// Procesar cada comando individualmente
	for i, linea := range lineas {
		linea = strings.TrimSpace(linea)

		// Saltar líneas vacías y comentarios
		if linea == "" || strings.HasPrefix(linea, "#") {
			continue
		}

		fmt.Printf("Procesando línea %d: %s\n", i+1, linea)

		// Procesar cada comando individualmente
		tempComandos := general.ExecuteCommandList([]string{linea})

		// Verificar si este comando específico tuvo éxito
		if salida, ok := tempComandos.Respuesta.(general.SalidaComandoEjecutado); ok {
			// Comando exitoso
			if len(salida.LstComandos) > 0 {
				resultados = append(resultados, map[string]interface{}{
					"linea":     i + 1,
					"comando":   linea,
					"resultado": salida.LstComandos[0], // Tomar el primer resultado
					"estado":    "exitoso",
				})
				comandosExitosos++

				// Ejecutar comandos globales para este comando exitoso
				_, contadorErrores := general.GlobalCom(salida.LstComandos)
				if contadorErrores > 0 {
					comandosFallidos++
				}
			}
		} else {
			// Comando fallido - registrarlo pero continuar
			resultados = append(resultados, map[string]interface{}{
				"linea":   i + 1,
				"comando": linea,
				"estado":  "fallido",
				"error":   "Error de sintaxis o comando no válido",
			})
			errores = append(errores, fmt.Sprintf("Línea %d: %s", i+1, linea))
			comandosFallidos++
		}
	}

	// Preparar respuesta
	response := map[string]interface{}{
		"success":           true,
		"message":           fmt.Sprintf("Procesamiento completado. Exitosos: %d, Fallidos: %d", comandosExitosos, comandosFallidos),
		"total_comandos":    len(lineas),
		"comandos_exitosos": comandosExitosos,
		"comandos_fallidos": comandosFallidos,
		"resultados":        resultados,
		"errores":           errores,
	}

	if len(errores) > 0 {
		response["advertencia"] = "Algunos comandos fallaron, pero se procesaron todos"
	}

	// Enviar respuesta
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Configurar encabezados CORS
func setCORSHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
	w.Header().Set("Access-Control-Max-Age", "86400")
}

// Función auxiliar para enviar errores
func sendJSONError(w http.ResponseWriter, message string, statusCode int, err error) {
	errorMsg := message
	if err != nil {
		errorMsg = fmt.Sprintf("%s: %v", message, err)
	}

	response := map[string]interface{}{
		"success": false,
		"error":   errorMsg,
		"status":  statusCode,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
