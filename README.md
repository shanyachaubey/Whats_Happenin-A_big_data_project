# what's happenin

## Overview

Whats Happenin is a website that focuses on providing users with location based topic segmented news. This repository provides all documentation, code, algorithms and details about the ideation, implementation and execution of the website. 

Whats Happenin is a website where the landing page consists of an interactive map. This interactive map allows user to choose the location of interest. There is a date filter that allows user to choose a relevant time frame for their search. When the user has chosen the desired location and date range, a bubble chart indicated the categories and volume of news. These categories include and are not limited to; Politics, Sports, Technology, Crime, Business, Education, Health and Environment. Once the categories appear, the user can click on either of the bubbles and get access to the top news articles in that category. Bseides providing focused access of news based on geography, this website will also provide top n statistics deemed important from the news. 

## Purpose

This website will serve the following purposes:
1) It can be used by users to assess a location based on the news from that area. This website uses news as an indicator for the socioeconomic, safety, technology development and business environment. All these factors are usually taken into consideration when deciding on a new place to relocate to.
2) Act as a fun tool for people to find out about the latest happenings in a certain area of their interest.
3) Stay updated about their home county.

## Process

The website will use several Big Data Technologies commonly used in the industry. The team will start with focusing the website on Colorado location, then scale up to the USA and if time permits the entire World. 

## Technical Process

The website will use the interactive action on the map and date filters to trigger the following processes:

1) Once the user selects a range of location on the map, the user's location of interest is determined.
2) User selects the date range.
3) Bubble chart gets generated on the left/right of the map displaying: Category, % of news articles in that category, The bubbles and the category names are both clickable links.
4) Along with the Bubble chart a list of Top n statistics from all the news articles considered in the search are also displayed.
5) User clicks on one of the categories (Either by clicking on the Bubble or the name of the category), the map, bubble chart and stats decrease in size and the majority of the screen becomes a grid view of top articles in that category from that location within given date range. These news articles will be displayed like a tile, with the title, date and an optional image within the tile.
6) The tiles must be clickable links to the original news article.
7) When user scrolls up from the tiles, the map, bubble chart and statistics must increase in size again.

## Technical Process details

This section will describe how each of the above 8 steps get executed from a technical standpoint. 

## Contributors

Shanya Chaubey, Masters in Data Science at University of Colorado Boulder - shch4240@colorado.edu, chaubeyshanya@gmail.com
Justin Jamrowski, Bachelors in Computer Science at University of Colorado Boulder -
Lohit Ramesh, Masters in Data Science at University of Colorado Boulder
Niharika Ng, Masters in Applied Mathematics at University of Colorado Boulder








