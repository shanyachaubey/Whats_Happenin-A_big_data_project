package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/shanyachaubey/Whats_Happenin-A_big_data_project/backend-interface/userquerysession/server/models"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Function to fetch data from Newscatcher API based on query parameters
func FetchDataFromAPI(query []string) (models.Articles, error) {
	var processedArticles models.Articles

	// Define the API endpoint
	apiURL := "https://api.newscatcherapi.com/v2/search"

	// Define the query parameters
	queryParams := url.Values{}
	queryParams.Set("lang", "en")
	queryParams.Set("from", query[0])
	queryParams.Set("to", query[1])
	queryParams.Set("q", query[2])
	queryParams.Set("lang", "en")
	queryParams.Set("countries", "US")
	queryParams.Set("ranked_only", "true")
	queryParams.Set("sort_by", "rank")
	queryParams.Set("page_size", "100")
	queryParams.Set("page", "1")

	// Encode the query parameters
	apiURL += "?" + queryParams.Encode()

	// Create a new HTTP request
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return models.Articles{}, status.Errorf(
			codes.Internal,
			fmt.Sprintf("Error creating request: %v", err))
	}

	// Set the API key header
	req.Header.Set("x-api-key", "kQ1Wu1fjWRZnriofBhD3ndcvOErvzkHld8UF5LttdNs")

	// Initialize allArticles map to store articles from multiple pages
	allArticles := make(map[string]interface{})
	totalPages := 5

	for page := 1; page <= totalPages; page++ {
		// Wait for 1 second between each call
		time.Sleep(2 * time.Second)

		// Send the HTTP request
		client := http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return models.Articles{}, status.Errorf(
				codes.Internal,
				fmt.Sprintf("Error sending request: %v", err))
		}

		defer resp.Body.Close()

		var result map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&result)
		if err != nil {
			return models.Articles{}, fmt.Errorf("Error decoding response: %v", err)
		}

		totalHits := 0
		if totalHitsFloat, ok := result["total_hits"].(float64); ok {
			totalHits = int(totalHitsFloat)
		}

		fmt.Printf("Number of articles fetched for %s: %d\n", query[2], totalHits)

		if len(allArticles) == 0 {
			allArticles = result
		} else {
			articles, ok := result["articles"].([]interface{})
			if !ok {
				return models.Articles{}, fmt.Errorf("Error: articles is not a slice")
			}
			allArticles["articles"] = append(allArticles["articles"].([]interface{}), articles...)
		}
	}

	articles := allArticles["articles"]
	if articles != nil {
		articles, ok := articles.([]interface{})
		if !ok {
			return models.Articles{}, fmt.Errorf("Error: articles is not a slice")
		}

		for _, articleItem := range articles {
			articleMap, ok := articleItem.(map[string]interface{})
			if !ok {
				return models.Articles{}, fmt.Errorf("Article Map cannot be converted to an interface")
			}

			// Extract fields from the article map
			rank, _ := articleMap["rank"].(int)
			location, _ := articleMap["location"].(string)
			title, _ := articleMap["title"].(string)
			excerpt, _ := articleMap["excerpt"].(string)
			summary, _ := articleMap["summary"].(string)
			link, _ := articleMap["link"].(string)
			author, _ := articleMap["author"].(string)
			publishedDate, _ := articleMap["published_date"].(string)
			imageLink, _ := articleMap["media"].(string)
			topic, _ := articleMap["topic"].(string)

			// Create a new models.Article and append to the slice
			processedArticle := models.Article{
				Rank:          rank,
				Location:      location,
				Title:         title,
				Excerpt:       excerpt,
				Summary:       summary,
				Link:          link,
				Author:        author,
				PublishedDate: publishedDate,
				ImageLink:     imageLink,
				Topic:         topic,
			}
			processedArticles = append(processedArticles, processedArticle)
		}
	}

	fmt.Println("Sanity Check")
	return processedArticles, nil
}
