package commands

import (
	estructures "Proyecto/Estructuras/structures"
	"encoding/binary"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

// MKDISK - Crear disco virtual
func MKDISK(params map[string]string) string {
	// Validar parámetros obligatorios
	sizeStr, ok := params["size"]
	if !ok || sizeStr == "" {
		return "Error: Parámetro -size es obligatorio"
	}

	size, err := strconv.Atoi(sizeStr)
	if err != nil || size <= 0 {
		return "Error: El tamaño debe ser un número positivo mayor que cero"
	}

	// Obtener unidad (opcional)
	unit := "M" // Valor por defecto
	if u, ok := params["unit"]; ok {
		unit = strings.ToUpper(u)
		if unit != "K" && unit != "M" {
			return "Error: Unidad debe ser K (Kilobytes) o M (Megabytes)"
		}
	}

	// Convertir tamaño a bytes
	var sizeBytes int
	if unit == "K" {
		sizeBytes = size * 1024
	} else {
		sizeBytes = size * 1024 * 1024
	}

	// Obtener ajuste (opcional)
	fit := "FF" // Valor por defecto
	if f, ok := params["fit"]; ok {
		fit = strings.ToUpper(f)
		if fit != "BF" && fit != "FF" && fit != "WF" {
			return "Error: Ajuste debe ser BF (Best Fit), FF (First Fit) o WF (Worst Fit)"
		}
	}

	// Generar nombre automático del disco
	diskName := generateDiskName()
	fullPath := diskName + ".mia"

	// Crear archivo .mia
	file, err := os.Create(fullPath)
	if err != nil {
		return "Error: No se pudo crear el archivo del disco"
	}
	defer file.Close()

	// Rellenar con ceros binarios
	buffer := make([]byte, 1024)
	totalWritten := 0

	for totalWritten < sizeBytes {
		remaining := sizeBytes - totalWritten
		if remaining < 1024 {
			buffer = make([]byte, remaining)
		}
		n, err := file.Write(buffer)
		if err != nil {
			return "Error al escribir en el disco"
		}
		totalWritten += n
	}

	// Crear MBR
	mbr := estructures.MBR{
		Mbr_tamano:         int32(sizeBytes),
		Mbr_fecha_creacion: int32(time.Now().Unix()),
		Mbr_disk_signature: generateDiskSignature(),
		Dsk_fit:            mapFitToByte(fit),
	}

	// Escribir MBR al inicio del archivo
	file.Seek(0, 0)
	binary.Write(file, binary.LittleEndian, &mbr)

	return fmt.Sprintf("Disco creado exitosamente: %s (%d bytes)", fullPath, sizeBytes)
}

// RMDISK - Eliminar disco virtual
func RMDISK(params map[string]string) string {
	diskName, ok := params["diskname"]
	if !ok || diskName == "" {
		return "Error: Parámetro -diskName es obligatorio"
	}

	// Asegurar extensión .mia si no la tiene
	if !strings.HasSuffix(strings.ToLower(diskName), ".mia") {
		diskName += ".mia"
	}

	// Verificar si el archivo existe
	if _, err := os.Stat(diskName); os.IsNotExist(err) {
		return "Error: El disco especificado no existe"
	}

	// Eliminar archivo
	err := os.Remove(diskName)
	if err != nil {
		return "Error: No se pudo eliminar el disco"
	}

	return fmt.Sprintf("Disco %s eliminado exitosamente", diskName)
}

// FDISK - Administrar particiones
func FDISK(params map[string]string) string {
	// Validar parámetros obligatorios
	diskName, ok := params["diskname"]
	if !ok || diskName == "" {
		return "Error: Parámetro -diskName es obligatorio"
	}

	// Asegurar extensión .mia si no la tiene
	if !strings.HasSuffix(strings.ToLower(diskName), ".mia") {
		diskName += ".mia"
	}

	// Verificar si el disco existe
	file, err := os.OpenFile(diskName, os.O_RDWR, 0644)
	if err != nil {
		return "Error: El disco especificado no existe"
	}
	defer file.Close()

	// Leer MBR existente
	var mbr estructures.MBR
	file.Seek(0, 0)
	binary.Read(file, binary.LittleEndian, &mbr)

	// Determinar operación
	name, hasName := params["name"]
	if !hasName || name == "" {
		return "Error: Parámetro -name es obligatorio"
	}

	// Verificar si ya existe una partición con ese nombre
	for i := 0; i < 4; i++ {
		partName := strings.TrimRight(string(mbr.Mbr_partitions[i].Part_name[:]), "\x00")
		if partName == name {
			return "Error: Ya existe una partición con ese nombre"
		}
	}

	// Obtener tipo de partición
	partType := "P" // Valor por defecto
	if t, ok := params["type"]; ok {
		partType = strings.ToUpper(t)
		if partType != "P" && partType != "E" && partType != "L" {
			return "Error: Tipo debe ser P (Primaria), E (Extendida) o L (Lógica)"
		}
	}

	// Validar restricciones de particiones
	if partType == "E" {
		// Solo puede haber una partición extendida por disco
		for i := 0; i < 4; i++ {
			if mbr.Mbr_partitions[i].Part_type == 'E' {
				return "Error: Ya existe una partición extendida en este disco"
			}
		}
	}

	// Contar particiones existentes
	partCount := 0
	for i := 0; i < 4; i++ {
		if mbr.Mbr_partitions[i].Part_status != 0 {
			partCount++
		}
	}

	if partCount >= 4 {
		return "Error: Máximo 4 particiones por disco"
	}

	// Obtener tamaño
	sizeStr, ok := params["size"]
	if !ok || sizeStr == "" {
		return "Error: Parámetro -size es obligatorio para crear partición"
	}

	size, err := strconv.Atoi(sizeStr)
	if err != nil || size <= 0 {
		return "Error: El tamaño debe ser un número positivo mayor que cero"
	}

	// Obtener unidad
	unit := "K" // Valor por defecto
	if u, ok := params["unit"]; ok {
		unit = strings.ToUpper(u)
		if unit != "B" && unit != "K" && unit != "M" {
			return "Error: Unidad debe ser B (Bytes), K (Kilobytes) o M (Megabytes)"
		}
	}

	// Convertir tamaño a bytes
	var sizeBytes int
	switch unit {
	case "B":
		sizeBytes = size
	case "K":
		sizeBytes = size * 1024
	case "M":
		sizeBytes = size * 1024 * 1024
	}

	// Validar que haya espacio suficiente
	if sizeBytes > int(mbr.Mbr_tamano) {
		return "Error: El tamaño de la partición excede el tamaño del disco"
	}

	// Obtener ajuste
	fit := "WF" // Valor por defecto
	if f, ok := params["fit"]; ok {
		fit = strings.ToUpper(f)
		if fit != "BF" && fit != "FF" && fit != "WF" {
			return "Error: Ajuste debe ser BF (Best Fit), FF (First Fit) o WF (Worst Fit)"
		}
	}

	// Encontrar espacio libre y crear partición
	// (Implementación simplificada - en realidad necesitarías algoritmo de ajuste)
	start := int32(binary.Size(mbr)) // Después del MBR

	for i := 0; i < 4; i++ {
		if mbr.Mbr_partitions[i].Part_status == 0 {
			// Espacio libre encontrado
			mbr.Mbr_partitions[i] = estructures.Partition{
				Part_status:      1,
				Part_type:        byte(partType[0]),
				Part_fit:         mapFitToByte(fit),
				Part_start:       start,
				Part_s:           int32(sizeBytes),
				Part_correlative: -1,
			}
			copy(mbr.Mbr_partitions[i].Part_name[:], name)

			// Escribir MBR actualizado
			file.Seek(0, 0)
			binary.Write(file, binary.LittleEndian, &mbr)

			return fmt.Sprintf("Partición '%s' creada exitosamente (%d bytes)", name, sizeBytes)
		}
		// Actualizar start para la siguiente partición
		start += mbr.Mbr_partitions[i].Part_s
	}

	return "Error: No hay espacio disponible para crear la partición"
}
