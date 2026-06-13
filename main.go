package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Serve static assets (CSS, JS, images) dari folder public/
	r.Static("/css", "./public/css")
	r.Static("/js", "./public/js")
	r.Static("/img", "./public/img")
	r.Static("/files", "./public/files") // untuk CV, dll.

	// Serve halaman utama portfolio
	r.GET("/", func(c *gin.Context) {
		c.File("./public/index.html")
	})

	// Fallback: semua route yang tidak dikenali → index.html
	r.NoRoute(func(c *gin.Context) {
		c.File("./public/index.html")
	})

	// Jalankan server di port 8080
	// Buka: http://localhost:8080
	r.Run(":8080")
}