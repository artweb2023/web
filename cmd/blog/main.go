package main

import (
	"fmt"
	"log"
	"net/http"
)

const port = ":3000"

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/home", index)
	mux.HandleFunc("/post", post)
	fmt.Println("Start server")
	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.ListenAndServe(port, mux)
	log.Println("Request completed successfully")
	err := http.ListenAndServe(port, mux)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(err)
}
