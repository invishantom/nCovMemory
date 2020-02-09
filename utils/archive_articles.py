'''
Usage: python archive_articles.py test.csv
Input: test.csv (comma delimited)
name , url
   1 , url1
   2 , url2
   .....
output:
1.png
2.png
.....
Dependency:
Firefox
pip install selenium
pip install pillow (for image compression)
brew install geckodriver (for mac)
'''



import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import csv
import sys
from PIL import Image
import math
import os
def fullpage_screenshot(nameAndURL):

    # Only work with Firefox; Chrome does not work
    options = webdriver.FirefoxOptions()
    options.add_argument("--headless");
    driver = webdriver.Firefox(options=options)
    driver.maximize_window()

    for i, pageInfo in enumerate(nameAndURL):
        name = pageInfo[0].strip()
        url = pageInfo[1].strip()
        print('Capturing {}/{}: '.format(str(i), str(len(nameAndURL))), name, url)
        # URL here
        driver.get(url)
        time.sleep(2)

        height = driver.execute_script("return document.body.scrollHeight")

        # The trick for lazy loading of images in WeChat articles
        driver.set_window_size(1000, height - 1000)
        driver.execute_script("window.scrollTo(0, 1000)")
        driver.execute_script("window.scrollTo(0, 0)")
        time.sleep(10) # new images need time to load
        new_height = driver.execute_script("return document.body.scrollHeight")
        driver.set_window_size(1000, new_height)

        image_path = os.path.join('../archive/png/'+name+".png")
        driver.save_screenshot(image_path)
        # Optimize image
        foo = Image.open(image_path)
        foo.save(image_path, optimize=True,quality=95)

    driver.quit()

if __name__ == "__main__":
    nameAndURL = []
    with open('../data/data.csv') as f:
        reader = csv.reader(f, delimiter=",")
        for i, line in enumerate(reader):
            if i !=0:
                if not os.path.isfile('../archive/jpg/{}.jpg'.format(line[0])):
                    if line[7]=='TRUE' and line[8]!='':
                        nameAndURL.append((line[0], line[8]))
                    elif line[7]=='TRUE' and line[9]!='':
                        nameAndURL.append((line[0], line[9]))
                        print('Alternative for {} does not exist! Using archive: ',format(line[0]), line[9])
                    elif line[7]!='TRUE':
                        nameAndURL.append((line[0], line[6]))
                    else:
                        raise ValueError()

                    # print('line[{}] = {}'.format(i, line))
                    # if i > 5:
                    #     break
        # lis = [line.split('	') for line in f]
        # for i, x in enumerate(lis):
        #     if i != 0:
        #         nameAndURL.append(x)
    # print(nameAndURL)
    fullpage_screenshot(nameAndURL)
