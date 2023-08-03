import time
import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service

def parse_win_loss_record(record):
    # Split the win-loss-tie record and extract win, loss, and tie values
    parts = record.split('-')
    if len(parts) == 3:
        win, loss, tie = parts
        return int(win), int(loss), int(tie)
    else:
        return None, None, None

def scrape_win_loss_records():
    base_url = "https://www.teamrankings.com/nfl/trends/win_trends/"
    years = range(2019, 2023)

    # Initialize lists to store the extracted data
    years_list = []
    team_names = []
    wins = []
    losses = []
    ties = []

    # Start the ChromeDriver service
    service = Service('C:\\chromedriver_win32\\chromedriver.exe')  # Replace with the actual path to chromedriver
    service.start()

    # Create a new instance of the Chrome driver
    driver = webdriver.Chrome(service=service)

    # Open the URL in Chrome
    driver.get(base_url)

    # Loop through each year
    for year in years:
        # Find the dropdown element to select the year
        dropdown = driver.find_element_by_id('range')

        # Find the option corresponding to the current year
        option = dropdown.find_element_by_xpath(f"//option[@value='yearly_{year}']")
        option.click()

        # Wait for a short duration for the page to load
        time.sleep(2)

        # Get the page source after selecting the year
        page_source = driver.page_source

        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(page_source, 'html.parser')

        # Find the table containing the win-loss records
        table = soup.find('table', class_='tr-table')

        if table:
            # Loop through each row in the table and extract the team name and win-loss record
            for row in table.find_all('tr'):
                columns = row.find_all('td')
                if len(columns) == 5:  # Ensure we have a valid row with data
                    team_name = columns[0].text.strip()
                    win_loss_record = columns[1].text.strip()

                    # Split win-loss-tie record into separate columns
                    win, loss, tie = parse_win_loss_record(win_loss_record)

                    years_list.append(year)
                    team_names.append(team_name)
                    wins.append(win)
                    losses.append(loss)
                    ties.append(tie)

            # Wait for a short duration before fetching data for the next year
            time.sleep(1)
        else:
            print(f"No data found for the year {year}")

    # Close the ChromeDriver
    driver.quit()

    # Combine data into a list of tuples
    data = list(zip(years_list, team_names, wins, losses, ties))

    # Create a Pandas DataFrame
    df = pd.DataFrame(data, columns=['Year', 'Team', 'Win', 'Loss', 'Tie'])

    # Save the data to a CSV file
    df.to_csv('nfl_win_loss_records_2019_to_2022.csv', index=False, encoding='utf-8')

# Example usage:
scrape_win_loss_records()
