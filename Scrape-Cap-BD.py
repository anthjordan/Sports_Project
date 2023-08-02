from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd

# Initialize browser
browser = Browser('chrome', executable_path='C:\\chromedriver_win32\\chromedriver.exe', headless=False)
# List of teams
teams = ['arizona-cardinals', 'atlanta-falcons', 'baltimore-ravens', 'buffalo-bills', 
         'carolina-panthers', 'chicago-bears', 'cincinnati-bengals', 'cleveland-browns', 
         'dallas-cowboys', 'denver-broncos', 'detroit-lions', 'green-bay-packers', 
         'houston-texans', 'indianapolis-colts', 'jacksonville-jaguars', 'kansas-city-chiefs', 
         'las-vegas-raiders', 'los-angeles-chargers', 'los-angeles-rams', 'miami-dolphins', 
         'minnesota-vikings', 'new-england-patriots', 'new-orleans-saints', 'new-york-giants', 
         'new-york-jets', 'philadelphia-eagles', 'pittsburgh-steelers', 'san-francisco-49ers', 
         'seattle-seahawks', 'tampa-bay-buccaneers', 'tennessee-titans', 'washington-football-team']

# List to store data
all_data = []

# Iterate over the years 2011 to 2023
for year in range(2011, 2024):
    for team in teams:
        # Visit the page
        url = f"https://www.spotrac.com/nfl/{team}/cap/{year}/"
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
        if active_table is not None:
            players = active_table.find_all('tr')

        # Iterate through each player
        for i, player in enumerate(players):
            name_tag = player.find('td', class_='player')
            if name_tag is not None:
                a_tag = name_tag.find('a')
                if a_tag is not None:
                    name = a_tag.text
                    position = player.find('td', class_='center small').text
                    cap_hit_tag = player.find('td', class_='right result')
                    if cap_hit_tag is not None:
                        cap_hit = cap_hit_tag.text.strip()
                    else:
                        cap_hit = None
                    cap_percentage_tag = player.find_all('td', class_='center')
                    if cap_percentage_tag and len(cap_percentage_tag) > 1:
                        cap_percentage = cap_percentage_tag[1].text.strip()
                    else:
                        cap_percentage = None

                    player_data = {"index": i, "year": year, "team": team, "name": name, 
                                   "position": position, "cap_hit": cap_hit, "cap_%": cap_percentage}

                    all_data.append(player_data)

# Convert the list of dictionaries to a dataframe
df = pd.DataFrame(all_data)

# Remove the '$' and ',' characters from the money columns and convert them to float
for column in ["cap_hit"]:
    df[column] = df[column].replace({'\$': '', ',': ''}, regex=True).astype(float)

# Save the dataframe to a csv file
df.to_csv("nfl_salary_data.csv", index=False)

# Close the browser
browser.quit()