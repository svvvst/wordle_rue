import pandas as pd
import csv

data = pd.read_csv('word_list\\alphabeticalWordList.txt',header=None).sample(frac=1).reset_index()
data = data.drop(columns='index')
print(data)
data.to_csv('word_list\\randomWordList.csv')