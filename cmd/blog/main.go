package main

import (
	"fmt"
	"net/http"
)

const port = ":3000"

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/home", index)
	mux.HandleFunc("/post", post)
	fmt.Println("Start server")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./cmd/blog/static"))))
	http.ListenAndServe(port, mux)
}
