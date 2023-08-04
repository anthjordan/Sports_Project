from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd

# Initialize browser
browser = Browser('chrome', executable_path='C:\\chromedriver_win32\\chromedriver.exe', headless=False)

# List of NFL teams
teams = ['arizona-cardinals', 'atlanta-falcons', 'baltimore-ravens', 'buffalo-bills', 
         'carolina-panthers', 'chicago-bears', 'cincinnati-bengals', 'cleveland-browns', 
         'dallas-cowboys', 'denver-broncos', 'detroit-lions', 'green-bay-packers', 
         'houston-texans', 'indianapolis-colts', 'jacksonville-jaguars', 'kansas-city-chiefs', 
         'las-vegas-raiders', 'los-angeles-chargers', 'los-angeles-rams', 'miami-dolphins', 
         'minnesota-vikings', 'new-england-patriots', 'new-orleans-saints', 'new-york-giants', 
         'new-york-jets', 'philadelphia-eagles', 'pittsburgh-steelers', 'san-francisco-49ers', 
         'seattle-seahawks', 'tampa-bay-buccaneers', 'tennessee-titans', 'washington-football-team']
all_data = []
for year in range(2011, 2023):
    for team in teams:
        # Visit the page
        url = f"https://www.spotrac.com/nfl/{team}/cap/{year}"
        browser.visit(url)

        # Create BeautifulSoup object; parse with 'html.parser'
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')

        # Find the correct table with Active Players
        all_tables = soup.find_all('table')
        active_table = None
        for table in all_tables:
            ths = table.find_all('th')
            for th in ths:
                if 'Active Players' in th.text:
                    active_table = table
                    break
            if active_table is not None:
                break

        # Retrieve all elements that contain player salary information
        players = active_table.find_all('tr')

        # Iterate through each player
        for player in players:
            # Use Beautiful Soup's find() method to navigate and retrieve attributes
            name_tag = player.find('td', class_='player')
            if name_tag is not None:
                a_tag = name_tag.find('a')
                if a_tag is not None:
                    name = a_tag.text
                    # Find all td tags within the player's row
                    all_tds = player.find_all('td')
                    if len(all_tds) >= 12:  # There should be at least 12 td tags if the player row is valid
                        position = all_tds[1].find('span').text
                        cap_hit = all_tds[2].find('span').text.strip()
                        cap_percentage = all_tds[11].text.strip()
                        
                        player_data = {
                            "year": year,
                            "team": team,
                            "name": name,
                            "position": position,
                            "cap_hit": cap_hit,
                            "cap_percentage": cap_percentage
                        }
                        all_data.append(player_data)

# Convert to a DataFrame and export to a csv file
df = pd.DataFrame(all_data)

# Reset the index to start from 1 and name the index column as "index"
df.index = df.index + 1
df.index.name = "index"

# Write DataFrame to CSV file
df.to_csv("nfl_salaries.csv")

# Close the browser
browser.quit()