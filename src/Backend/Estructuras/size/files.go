package size

import (
	// "proyecto/estructuras/estructures"
	estructures "Proyecto/Estructuras/structures"
	"unsafe"
)

func SizeSuperBloque() int32 { //68 bytes
	a01 := unsafe.Sizeof(estructures.SuperBloque{}.S_filesistem_type)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_inodes_count)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_blocks_count)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_free_blocks_count)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_free_inodes_count)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_mtime)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_umtime)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_mnt_count)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_magic)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_inode_s)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_block_s)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_first_ino)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_first_blo)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_bm_inode_start)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_bm_block_start)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_inode_start)
	a01 += unsafe.Sizeof(estructures.SuperBloque{}.S_block_start)
	return int32(a01)
}

func SizeTablaInodo() int32 { //92 bytes
	a01 := unsafe.Sizeof(estructures.TablaInodo{}.I_uid)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_gid)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_s)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_atime)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_ctime)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_mtime)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_block)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_type)
	a01 += unsafe.Sizeof(estructures.TablaInodo{}.I_perm)
	return int32(a01)
}
