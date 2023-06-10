package main

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

type featuredPostData struct {
	PostUrl     string
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
	PostUrl     string
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
	FeaturedPost []*featuredPostData
	RecentPost   []*recentPostData
}

type postPageData struct {
	Title    string `db:"title"`
	Subtitle string `db:"subtitle"`
	PostText string `db:"post_text"`
	PostImg  string `db:"image_url"`
	Text     []string
}

type createPostRequest struct {
	Title       string   `json:"title"`
	Subtitle    string   `json:"description"`
	Author      string   `json:"name"`
	AuthorImg   string   `json:"avatar"`
	PublishDate string   `json:"date"`
	PostImage   string   `json:"boxImage"`
	PostText    []string `json:"content"`
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

func login(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println(err.Error())
		return
	}
}

func admin(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/admin.html")
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		err = ts.Execute(w, nil)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}
		log.Println("Request completed successfully")
	}
}

func createPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		reqData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		var req createPostRequest

		err = json.Unmarshal(reqData, &req)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		authorImg, err := base64.StdEncoding.DecodeString(req.AuthorImg)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		postImg, err := base64.StdEncoding.DecodeString(req.PostImage)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		authorFileName := uuid.New().String() + ".jpg" // Генерация названия файла для аватара автора
		authorFilePath := "static/img/" + authorFileName

		authorFile, err := os.Create(authorFilePath)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		defer authorFile.Close()

		_, err = authorFile.Write(authorImg)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		postFileName := uuid.New().String() + ".jpg" // Генерация названия файла для изображения поста
		postFilePath := "static/img/" + postFileName
		postFileUrl := "/" + postFilePath

		postFile, err := os.Create(postFilePath)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		defer postFile.Close()

		_, err = postFile.Write(postImg)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		err = savePost(db, req, authorFilePath, postFileUrl)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			log.Println(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
	}
}

func savePost(db *sqlx.DB, req createPostRequest, authorURL, postImageURL string) error {
	const query = `
		INSERT INTO
			post
		(
			title,
			subtitle,
			author,
			author_url,
			publish_date,
			image_url,
			post_text,
			category,
			featured
		)
		VALUES
		(
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?,
			?
		)
	`

	postText := strings.Join(req.PostText, "\n\n")

	_, err := db.Exec(query, req.Title, req.Subtitle, req.Author, authorURL, req.PublishDate, postImageURL, postText, 0, 0)
	return err
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

func featuredPosts(db *sqlx.DB) ([]*featuredPostData, error) {
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

	var featuredposts []*featuredPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&featuredposts, query) // Делаем запрос в базу данных
	if err != nil {                         // Проверяем, что запрос в базу данных не завершился с ошибкой
		return nil, err
	}

	for _, fpost := range featuredposts {
		fpost.PostUrl = "/post/" + fpost.PostId // Формируем исходя из ID поста в базе
	}

	return featuredposts, nil
}

func recentPost(db *sqlx.DB) ([]*recentPostData, error) {
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

	var recentpost []*recentPostData // Заранее объявляем массив с результирующей информацией

	err := db.Select(&recentpost, query) // Делаем запрос в базу данных
	if err != nil {                      // Проверяем, что запрос в базу данных не завершился с ошибкой
		return nil, err
	}

	for _, rpost := range recentpost {
		rpost.PostUrl = "/post/" + rpost.PostId // Формируем исходя из ID поста в базе
	}

	return recentpost, nil
}
