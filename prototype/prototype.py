import random

# Word list
# http://www.mieliestronk.com/corncob_lowercase.txt

letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

weights = [ 13, 3, 3, 6, 18, 3, 4, 3, 12, 2, 2, 5, 3, 8, 11, 3, 2, 9, 6, 9, 6, 3, 3, 2, 3, 2]

length = 12

for _ in range(length):
    row = random.choices(letters, weights, k=length)
    print("    ".join(row))
    print()


for i in zip(letters, weights):
    for j in range(i[1]):
        print(i[0], end="")
print()
