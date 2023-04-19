package main

import (
	"database/sql"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type featuredPostData struct {
	PostId      string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	PostImg     string `db:"image_url"`
	PostTag     string `db:"category"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
}

type recentPostData struct {
	PostId      string `db:"post_id"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	PostImg     string `db:"image_url"`
	Category    string `db:"category"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_url"`
	PublishDate string `db:"publish_date"`
}

type indexPageData struct {
	FeaturedPost []featuredPostData
	RecentPost   []recentPostData
}

type postPageData struct {
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	PostText string `db:"post_text"`
	PostImg  string `db:"image_url"`
	Text     []string
}

func index(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		featuredposts, err := featuredPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return // Не забываем завершить выполнение ф-ии
		}
		recentpost, err := recentPost(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return // Не забываем завершить выполнение ф-ии
		}

		ts, err := template.ParseFiles("pages/index.html") // Главная страница блога
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return // Не забываем завершить выполнение ф-ии
		}

		data := indexPageData{
			FeaturedPost: featuredposts,
			RecentPost:   recentpost,
		}

		err = ts.Execute(w, data) // Заставляем шаблонизатор вывести шаблон в тело ответа
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func post(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		postIdStr := mux.Vars(r)["postID"]     // Получаем значение параметра id из URL
		postId, err := strconv.Atoi(postIdStr) // Конвертируем строку orderID в число
		if err != nil {
			if err == sql.ErrNoRows {
				// sql.ErrNoRows возвращается, когда в запросе к базе не было ничего найдено
				// В таком случае мы возвращем 404 (not found) и пишем в тело, что ордер не найден
				http.Error(w, "Post not found", 404)
				log.Println(err)
				return
			}

			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		postdata, err := Posts(db, postId)
		if err != nil {
			http.Error(w, "Internal Server Error", 500) // В случае ошибки парсинга - возвращаем 500
			log.Println(err)
			return // Не забываем завершить выполнение ф-ии
		}

		ts, err := template.ParseFiles("pages/post.html") // Главная страница блога
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}
		data := postdata

		err = ts.Execute(w, data) // Заставляем шаблонизатор вывести шаблон в тело ответа
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func Posts(db *sqlx.DB, postId int) (postPageData, error) {
	const query = `
	SELECT
		title,
		subtitle,
		post_text,
		image_url
	FROM
		post
	WHERE
		post_id = ?
` // Запрос на получение информации о посте с заданным id

	var postdata postPageData               // Заранее объявляем массив с результирующей информацией
	err := db.Get(&postdata, query, postId) // Делаем запрос в базу данных
	if err != nil {
		return postdata, err
	}
	postdata.Text = strings.Split(postdata.PostText, "\n")
	return postdata, nil
}

func featuredPosts(db *sqlx.DB) ([]featuredPostData, error) {
	const query = `
		SELECT
		    post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			category,
			image_url
		FROM
			post
		WHERE featured = 1
	` // Составляем SQL-запрос для получения записей для секции featured-posts

	var featuredposts []featuredPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&featuredposts, query) // Делаем запрос в базу данных
	if err != nil {                         // Проверяем, что запрос в базу данных не завершился с ошибкой
		return nil, err
	}

	return featuredposts, nil
}

func recentPost(db *sqlx.DB) ([]recentPostData, error) {
	const query = `
		SELECT
			post_id,
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			category,
			image_url
		FROM
			post
		WHERE featured = 0
	` // Составляем SQL-запрос для получения записей для секции featured-posts

	var recentpost []recentPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&recentpost, query) // Делаем запрос в базу данных
	if err != nil {                      // Проверяем, что запрос в базу данных не завершился с ошибкой
		return nil, err
	}

	return recentpost, nil
}
