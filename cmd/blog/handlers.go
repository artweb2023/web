package main

import (
	"html/template"
	"log"
	"net/http"
)

type featuredPostData struct {
	Title           string
	Subtitle        string
	ImgModifier     string
	PostTagModifier string
	Author          string
	AuthorImg       string
	PublishDate     string
}

type recentPostData struct {
	Title       string
	Subtitle    string
	PostImg     string
	Author      string
	AuthorImg   string
	PublishDate string
}

type PostData struct {
	FeaturedPost []featuredPostData
	RecentPost   []recentPostData
}

func index(w http.ResponseWriter, r *http.Request) { // Функция для отдачи страницы
	ts, err := template.ParseFiles("cmd/blog/pages/index.html")
	if err != nil { // nil пустота переменных
		http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
		log.Println(err.Error())                    // Используем стандартный логгер для вывода ошибки в консоль
		return                                      // Не забываем завершить выполнение ф-ии
	}

	data := PostData{
		FeaturedPost: featuredPosts(),
		RecentPost:   recentPost(),
	}

	err = ts.Execute(w, data) // Запускаем шаблонизатор для вывода шаблона в тело ответа
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	log.Println("Request completed successfully")
}

func post(w http.ResponseWriter, r *http.Request) { // Функция для отдачи страницы
	ts, err := template.ParseFiles("cmd/blog/pages/post.html") // Главная страница блога  ts переменная куда парситься шаблон
	if err != nil {                                            // nil пустота переменных
		http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
		log.Println(err.Error())                    // Используем стандартный логгер для вывода ошибки в консоль
		return                                      // Не забываем завершить выполнение ф-ии
	}

	data := PostData{}

	err = ts.Execute(w, data) // Запускаем шаблонизатор для вывода шаблона в тело ответа
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	log.Println("Request completed successfully")
}

func featuredPosts() []featuredPostData {
	return []featuredPostData{
		{
			Title:           "The Road Ahead",
			Subtitle:        "The road ahead might be paved - it might not be.",
			ImgModifier:     "background_left",
			PostTagModifier: "no-show",
			Author:          "Mat Vogels",
			AuthorImg:       "static/img/mat-vogles.png",
			PublishDate:     "September 25, 2015",
		},
		{
			Title:           "From Top Down",
			Subtitle:        "Once a year, go someplace you’ve never been before.",
			ImgModifier:     "background_rigth",
			PostTagModifier: "show",
			Author:          "William Wong",
			AuthorImg:       "static/img/william-wong.png",
			PublishDate:     "September 25, 2015",
		},
	}
}

func recentPost() []recentPostData {
	return []recentPostData{
		{
			Title:       "Still Standing Tall",
			Subtitle:    "Life begins at the end of your comfort zone.",
			PostImg:     "static/img/air_balloon.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/william-wong.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Sunny Side Up",
			Subtitle:    "No place is ever as bad as they tell you it’s going to be.",
			PostImg:     "static/img/bridg.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat-vogles.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Water Falls",
			Subtitle:    "We travel not to escape life, but for life not to escape us.",
			PostImg:     "static/img/lakes.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat-vogles.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Through the Mist",
			Subtitle:    "Travel makes you see what a tiny place you occupy in the world.",
			PostImg:     "static/img/seawave.png",
			Author:      "William Wong",
			AuthorImg:   "static/img/william-wong.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Awaken Early",
			Subtitle:    "Not all those who wander are lost.",
			PostImg:     "static/img/ropeway.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat-vogles.png",
			PublishDate: "9/25/2015",
		},
		{
			Title:       "Try it Always",
			Subtitle:    "The world is a book, and those who do not travel read only one page.",
			PostImg:     "static/img/waterfall.png",
			Author:      "Mat Vogels",
			AuthorImg:   "static/img/mat-vogles.png",
			PublishDate: "9/25/2015",
		},
	}
}
