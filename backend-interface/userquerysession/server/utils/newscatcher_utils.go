package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Function to fetch data from Newscatcher API based on query parameters
func FetchDataFromAPI(query []string) (interface{}, error) {
	// var processedArticles models.Articles

	// Define the API endpoint
	apiURL := "https://api.newscatcherapi.com/v2/search"

	// Initialize allArticles map to store articles from multiple pages
	allArticles := make(map[string]interface{})
	page := 1

	for page < 6 {
		// Define the query parameters
		queryParams := url.Values{}
		queryParams.Set("from", query[0])
		queryParams.Set("to", query[1])
		queryParams.Set("q", query[2])
		queryParams.Set("lang", "en")
		queryParams.Set("countries", "US")
		queryParams.Set("ranked_only", "true")
		queryParams.Set("sort_by", "rank")
		queryParams.Set("page_size", "100")
		queryParams.Set("page", fmt.Sprintf("%d", page))

		// Encode the query parameters
		fullURL := apiURL + "?" + queryParams.Encode()

		// Create a new HTTP request
		req, err := http.NewRequest("GET", fullURL, nil)
		if err != nil {
			return map[string]interface{}{}, status.Errorf(
				codes.Internal,
				fmt.Sprintf("Error creating request: %v", err))
		}

		// Set the API key header
		req.Header.Set("x-api-key", "kQ1Wu1fjWRZnriofBhD3ndcvOErvzkHld8UF5LttdNs")

		// Send the HTTP request
		client := http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return map[string]interface{}{}, status.Errorf(
				codes.Internal,
				fmt.Sprintf("Error sending request: %v", err))
		}

		defer resp.Body.Close()

		var result map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&result)
		if err != nil {
			return map[string]interface{}{}, fmt.Errorf("Error decoding response: %v", err)
		}

		if len(allArticles) == 0 {
			allArticles = result
		} else {
			articles, ok := result["articles"].([]interface{})
			if !ok {
				return map[string]interface{}{}, fmt.Errorf("Error: articles is not a slice")
			}
			allArticles["articles"] = append(allArticles["articles"].([]interface{}), articles...)
		}
		page++
		if page > int(result["total_pages"].(float64)) {
			break
		}
		// Wait for 1 second between each call
		time.Sleep(1 * time.Second)
	}

	articles := allArticles["articles"]
	fmt.Println("Sanity Check")
	return articles, nil
}
