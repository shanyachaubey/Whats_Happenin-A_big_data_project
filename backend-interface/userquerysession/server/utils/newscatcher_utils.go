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

// FetchDataFromAPI fetches data from Newscatcher API based on query parameters
func FetchDataFromAPI(query []string) ([]interface{}, error) {
	const apiURL = "https://api.newscatcherapi.com/v2/search"
	const apiKey = "kQ1Wu1fjWRZnriofBhD3ndcvOErvzkHld8UF5LttdNs"

	var allArticles []interface{}
	client := http.Client{}

	location := query[2]
	startDate := query[0]
	endDate := query[1]

	for page := 1; page < 6; page++ {
		queryParams := url.Values{
			"from":        {startDate},
			"to":          {endDate},
			"q":           {location},
			"lang":        {"en"},
			"countries":   {"US"},
			"ranked_only": {"true"},
			"sort_by":     {"rank"},
			"page_size":   {"100"},
			"page":        {fmt.Sprintf("%d", page)},
		}

		fullURL := apiURL + "?" + queryParams.Encode()

		req, err := http.NewRequest("GET", fullURL, nil)
		if err != nil {
			return make([]interface{}, 0), status.Errorf(
				codes.Internal,
				fmt.Sprintf("Error creating request: %v", err))
		}

		req.Header.Set("x-api-key", apiKey)
		resp, err := client.Do(req)
		if err != nil {
			return make([]interface{}, 0), status.Errorf(
				codes.Internal,
				fmt.Sprintf("Error sending request: %v", err))
		}
		defer resp.Body.Close()

		var result map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&result)
		if err != nil {
			return make([]interface{}, 0), fmt.Errorf("Error decoding response: %v", err)
		}

		articles, ok := result["articles"].([]interface{})
		if !ok {
			return make([]interface{}, 0), fmt.Errorf("error: articles is not a slice")
		}

		allArticles = append(allArticles, articles...)

		if page >= int(result["total_pages"].(float64)) {
			break
		}

		// Wait for 1 second between each call
		time.Sleep(1 * time.Second)
	}

	fmt.Println("Sanity Check")
	return allArticles, nil
}
