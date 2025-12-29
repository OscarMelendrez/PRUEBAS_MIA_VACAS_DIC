package main

import (
	"Proyecto/comandos/controllers"
	"fmt"
	"net/http"

	"github.com/fatih/color"
	"github.com/rs/cors"
)

func main() {
	mux := http.NewServeMux()
	puerto := 3000
	c := cors.AllowAll()
	ruta := "/GoDisk" //------> ruta principal

	//======================= RUTAS =====================

	//http://localhost:3000/GoDisk/commands
	handler := RecoverMiddleware(c.Handler(mux))
	mux.HandleFunc(""+fmt.Sprintf("%v", ruta)+"/commands", controllers.HandleCommand)

	fmt.Println("" + fmt.Sprintf("Backend corriendo en puerto: %v", puerto)) //-------> puerto corriendo
	fmt.Println("" + fmt.Sprintf("Ruta principal: localHost:3000%v", ruta))

	//error al iniciar
	err := http.ListenAndServe(":"+fmt.Sprintf("%v", puerto), handler)
	if err != nil {
		color.Red("Error al iniciar el sevidor", err)
	}
}

// =========================== RECUPERACION DE ERRORES =======================
func RecoverMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if rec := recover(); rec != nil {
				// log.Println("panic:", rec)
				http.Error(w, "Error interno", http.StatusInternalServerError)
			}
		}()
		next.ServeHTTP(w, r)
	})
}
