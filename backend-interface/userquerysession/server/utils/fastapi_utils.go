package utils

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
)

func MakePythonPipelineRequest(oid string) (bool, error) {
	fastapi_url := fmt.Sprintf("http://fastapi-service.%s.svc.cluster.local:8000/articles", namespace)
        
	// Define request parameters
	params := url.Values{}
	params.Set("oid", oid)

	// Create a new request with the specified URL and parameters
	req, err := http.NewRequest("PUT", fastapi_url, nil)
	if err != nil {
		log.Fatalf("Failed to create request: %v", err)
	}
        
	// Set request headers
	req.Header.Set("Accept", "application/json")

	// Add URL parameters to the request
	req.URL.RawQuery = params.Encode()

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()
        
	// Check response status code
	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("Error: %v", resp.StatusCode)
	}

	return true, nil
}

